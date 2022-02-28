import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  try {
    const email = session.user!.email ?? undefined;
    const getDrafts = await prisma.post.findMany({
      where: {
        published: false,
        user: {
          email,
        },
      },
      orderBy: [{ updatedAt: 'desc' }],
    });

    const getPublished = await prisma.post.findMany({
      where: {
        published: true,
        user: {
          email,
        },
      },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        firstPublishedAt: true,
        cover: true,
        publications: true,
        published: true,
      },
      orderBy: [{ firstPublishedAt: 'desc' }],
      take: 10,
    });
    return res.status(200).json([...getDrafts, ...getPublished]);
  } catch (error: any) {
    console.error('[api] post', error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default handler;
