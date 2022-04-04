import { handlePrismaError, prisma } from '@lib/prisma';
import { Prisma } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const postId: string = req.body?.postId;

  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  if (!postId) {
    return res.status(422).json({
      message: 'Missing parameters',
    });
  }

  try {
    await prisma.publication.deleteMany({
      where: {
        postId,
      },
    });

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        scheduledAt: null,
        published: false,
        tags: null,
        rawTags: Prisma.JsonNull,
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
