import { decrypt } from '@lib/encrypt';
import { handlePrismaError, prisma } from '@lib/prisma';
import providers from '@lib/providers';
import { SelectOption } from '@models/selectOption';
import {
  Integration,
  Post,
  Prisma,
  Provider,
  Publication,
} from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const post: Post = req.body?.post;
  const tags: SelectOption[] = req.body?.tags;
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

    let publications: Publication[] = [];
    if (integrationOriginal) {
      let publicationsToCreate: Omit<Publication, 'id'>[] = [];
      integrationOriginal.token = decrypt(
        integrationOriginal.token,
        process.env.NEXT_PUBLIC_INTEGRATION_SECRET!
      );

      // start by publishing original one
      const original: Omit<Publication, 'id'> = await providers[
        integrationOriginal.provider.name
      ].publishNewArticle(post, tags, integrationOriginal);

      original.isCanonical = true;
      publicationsToCreate.push(original);

      const otherIntegrations = integrations.filter(
        ({ id }) => id !== originalIntegrationId
      );

      if (otherIntegrations?.length > 0) {
        const promises: Promise<Omit<Publication, 'id'>>[] =
          otherIntegrations?.map((integration) => {
            integration.token = decrypt(
              integration.token,
              process.env.NEXT_PUBLIC_INTEGRATION_SECRET!
            );
            return providers[integration.provider.name].publishNewArticle(
              post,
              tags,
              integration,
              original.url
            );
          });

        const result = await Promise.all(promises);
        publicationsToCreate = [...publicationsToCreate, ...result];
      }

      await prisma.publication.createMany({
        data: publicationsToCreate,
        skipDuplicates: true,
      });

      const updatedUser = await prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          published: true,
          firstPublishedAt: new Date(),
          tags:
            tags && tags?.length > 0
              ? tags.map((tag) => tag.label.split(' ').join('')).toString()
              : '',
        },
        include: {
          publications: {
            where: {
              postId: post.id,
            },
          },
        },
      });

      publications = updatedUser?.publications;
    }

    return res.status(200).json({ publications });
  } catch (error) {
    console.log(error);
    let message = String(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      message = handlePrismaError(error);
    } else if (error instanceof Error) {
      message = error.message;
    }
    return res
      .status(500)
      .json({ statusCode: 500, message: message ?? 'An error occured' });
  }
};

export default withSentry(handler);
