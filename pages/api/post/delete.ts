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
    const deleted = await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return res.status(200).json(deleted);
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
