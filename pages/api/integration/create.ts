import prisma from '@lib/prisma';
import providers from '@lib/providers';
import { Integration, ProviderName } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const token: string = req.body?.token;
  const username: string | undefined = req.body?.username;
  const providerId: string = req.body?.providerId;
  const providerName: ProviderName = req.body?.providerName;

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

    const userData: Partial<Integration> = await providers[providerName].init({
      token,
      username,
    });

    if (!userData || (username && !userData?.publicationId)) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const newIntegration = await prisma.integration.create({
      data: {
        token,
        username: username ?? userData.username,
        publicationId: userData.publicationId,
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
