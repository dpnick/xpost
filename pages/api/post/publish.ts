import prisma from '@lib/prisma';
import providers from '@lib/providers';
import { Integration, Post, Provider, Publication } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const post: Post = req.body?.post;
  const integrations: (Integration & { provider: Provider })[] =
    req.body?.integrations;
  const originalIntegrationId: string = req.body?.originalIntegrationId;

  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  if (integrations?.length < 1 || !originalIntegrationId) {
    return res.status(422).json({
      message: 'Missing parameters',
    });
  }

  try {
    const integrationOriginal = integrations.find(
      ({ id }) => id === originalIntegrationId
    );

    let url = '';
    if (integrationOriginal) {
      let publicationsToCreate: Omit<Publication, 'id'>[] = [];

      // start by publishing original one
      const original = await providers[
        integrationOriginal.provider.name
      ].publishNewArticle(post, integrationOriginal);

      original.isCanonical = true;
      publicationsToCreate.push(original);

      console.log(original);
      url = original.url;

      const otherIntegrations = integrations.filter(
        ({ id }) => id !== originalIntegrationId
      );

      if (otherIntegrations?.length > 0) {
        const promises = otherIntegrations?.map((integration) =>
          providers[integration.provider.name].publishNewArticle(
            post,
            integration,
            original.url
          )
        );

        const result = await Promise.all(promises);
        console.log(result);

        publicationsToCreate = [...publicationsToCreate, ...result];
      }

      await prisma.publication.createMany({
        data: publicationsToCreate,
        skipDuplicates: true,
      });

      await prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          published: true,
          firstPublishedAt: new Date(),
        },
      });
    }

    return res.status(200).json({ url });
  } catch (error: any) {
    console.error('[api] integration', error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default handler;
