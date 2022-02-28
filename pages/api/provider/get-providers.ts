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

    const providers = await prisma.provider.findMany();
    const integrations = await prisma.integration.findMany({
      where: {
        user: {
          email,
        },
      },
      include: {
        provider: true,
      },
    });

    return res.status(200).json({ providers, integrations });
  } catch (error: any) {
    console.error('[api] provider', error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default handler;
