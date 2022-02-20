import prisma from '@lib/prisma';
import { Post } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const update: Partial<Post> = req.body?.update;
  const pid: string = req.body?.pid;

  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: pid,
      },
      data: update,
    });
    return res.status(200).json(updatedPost);
  } catch (error: any) {
    console.error('[api] post', error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default handler;
