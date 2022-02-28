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
      include: {
        publications: true,
      },
      orderBy: [{ firstPublishedAt: 'desc' }],
      take: 10,
    });
    return res.status(200).json([...getDrafts, ...getPublished]);
  } catch (error) {
    let message = String(error);
    if (error instanceof Error) message = error.message;
    return res.status(500).json({ statusCode: 500, message });
  }
};

export default handler;
