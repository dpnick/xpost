import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = req.body?.session;

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
      select: {
        id: true,
        title: true,
        createdAt: true,
        cover: true,
      },
      orderBy: [{ updatedAt: 'desc' }],
      take: 10,
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
        createdAt: true,
        cover: true,
      },
      orderBy: [{ firstPublishedAt: 'desc' }],
      take: 10,
    });
    return res.status(200).json({ drafts: getDrafts, published: getPublished });
  } catch (error: any) {
    console.error('[api] post', error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default handler;
