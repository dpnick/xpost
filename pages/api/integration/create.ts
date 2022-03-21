import { decrypt } from '@lib/encrypt';
import { handlePrismaError, prisma } from '@lib/prisma';
import providers from '@lib/providers';
import { Integration, Prisma, ProviderName } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
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

    const decryptedToken = decrypt(
      token,
      process.env.NEXT_PUBLIC_INTEGRATION_SECRET!
    );

    const userData: Partial<Integration> = await providers[providerName].init({
      token: decryptedToken,
      username,
    });

    if (!userData || (username && !userData?.publicationId)) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Unable to get your publication identifier',
      });
    }

    const newIntegration = await prisma.integration.create({
      data: {
        token,
        username: username ?? userData.username!,
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
  } catch (error) {
    let message = String(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      message = handlePrismaError(error);
    } else if (error instanceof Error) {
      message = error.message;
    }
    return res
      .status(500)
      .json({ statusCode: 500, message: message ?? 'An error occured' });
  }
};

export default withSentry(handler);
