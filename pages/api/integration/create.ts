import prisma from '@lib/prisma';
import providers from '@lib/providers';
import { ProviderName } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const token: string = req.body?.token;
  const username: string = req.body?.username;
  const providerId: string = req.body?.providerId;
  const providerName: ProviderName = req.body?.providerName;
  const needInit: string = req.body?.needInit;

  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  if (!token || !providerId) {
    return res.status(422).json({
      message: 'Missing parameters',
    });
  }

  try {
    const email = session.user!.email ?? undefined;

    let publicationId: string | undefined = undefined;
    if (needInit) {
      publicationId = await providers[providerName].init!({ token, username });
    }

    const newIntegration = await prisma.integration.create({
      data: {
        username,
        token,
        publicationId,
        user: {
          connect: {
            email,
          },
        },
        provider: {
          connect: {
            id: providerId,
          },
        },
      },
      include: {
        provider: true,
      },
    });

    return res.status(200).json(newIntegration);
  } catch (error: any) {
    console.error('[api] integration', error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default handler;
