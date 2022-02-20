import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const token: string = req.body?.token;
  const integrationId: string = req.body?.integrationId;

  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  if (!token || !integrationId) {
    return res.status(422).json({
      message: 'Missing parameters',
    });
  }

  try {
    const deleted = await prisma.integration.delete({
      where: {
        id: integrationId,
      },
    });

    return res.status(200).json(deleted);
  } catch (error: any) {
    console.error('[api] integration', error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default handler;
