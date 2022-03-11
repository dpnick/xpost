import { decrypt } from '@lib/encrypt';
import { handlePrismaError, prisma } from '@lib/prisma';
import providers from '@lib/providers';
import { Prisma } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
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
    const promises = integrations.map((integration) => {
      integration.token = decrypt(
        integration.token,
        process.env.NEXT_PUBLIC_INTEGRATION_SECRET!
      );
      return providers[integration.provider!.name].getUserInfos(integration);
    });
    const result = await Promise.all(promises);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
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
