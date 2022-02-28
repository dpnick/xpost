import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const title = req.body?.title;
  const content = req.body?.title;

  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  try {
    const email = session.user!.email ?? undefined;

    const createPost = await prisma.post.create({
      data: {
        title,
        content,
        user: {
          connect: {
            email,
          },
        },
      },
    });
    return res.status(200).json(createPost);
  } catch (error) {
    let message = String(error);
    if (error instanceof Error) message = error.message;
    return res.status(500).json({ statusCode: 500, message });
  }
};

export default handler;
