import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const pid = req.body?.pid;

  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  try {
    const email = session.user!.email ?? undefined;
    const getPost = await prisma.post.findFirst({
      where: {
        id: pid,
        user: {
          email,
        },
      },
      include: {
        publications: true,
      },
    });
    return res.status(200).json(getPost);
  } catch (error: any) {
    console.error('[api] post', error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default handler;
