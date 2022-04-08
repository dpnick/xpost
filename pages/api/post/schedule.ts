import { handlePrismaError, prisma } from '@lib/prisma';
import { SelectOption } from '@models/selectOption';
import { Integration, Prisma, Provider, Publication } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const postId: string = req.body?.postId;
  const scheduledAt: Date = req.body?.scheduledAt;

  const tags: SelectOption[] = req.body?.tags;
  const slug: string = req.body?.slug;
  const integrations: (Integration & { provider: Provider })[] =
    req.body?.integrations;
  const originalIntegrationId: string = req.body?.originalIntegrationId;

  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  if (
    integrations?.length < 1 ||
    !originalIntegrationId ||
    !scheduledAt ||
    !postId ||
    !slug
  ) {
    return res.status(422).json({
      message: 'Missing parameters',
    });
  }

  try {
    // create publication for each integration
    // update post to add infos => tags, scheduledAt, publication(s).
    const publicationsToCreate: Omit<Publication, 'id' | 'postId'>[] =
      integrations.map(({ id }) => ({
        publishedAt: scheduledAt,
        integrationId: id,
        isCanonical: id === originalIntegrationId,
        url: '', // need to be updated once published in publish-scheduled
      }));

    const rawTagsJson =
      tags && tags?.length > 0
        ? (tags.map((tag) => JSON.stringify(tag)) as Prisma.JsonArray)
        : Prisma.JsonNull;

    await prisma.post.update({
      where: { id: postId },
      data: {
        scheduledAt,
        rawTags: rawTagsJson,
        tags:
          tags && tags?.length > 0
            ? tags.map((tag) => tag.label.split(' ').join('')).toString()
            : '',
        slug,
        publications: {
          create: publicationsToCreate,
        },
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
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
