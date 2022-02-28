import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const cover: string = req.body?.cover;
  const pid: string = req.body?.pid;

  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  if (!cover || !pid) {
    return res.status(422).json({
      message: 'Missing parameters',
    });
  }

  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: pid,
      },
      data: {
        cover,
      },
    });
    return res.status(200).json(updatedPost);
  } catch (error) {
    let message = String(error);
    if (error instanceof Error) message = error.message;
    return res.status(500).json({ statusCode: 500, message });
  }
};

export default handler;
