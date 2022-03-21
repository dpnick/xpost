import { handlePrismaError, prisma } from '@lib/prisma';
import { Prisma } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { DAILY_BASE_URL } from 'pages/dashboard/inspirations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const rss = req.body?.rss;

  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  if (!rss) {
    return res.status(422).json({
      message: 'Missing parameters',
    });
  }

  try {
    const email = session.user!.email ?? undefined;

    // check if we are able to get data from this url
    const rawResult = await fetch(rss, {
      headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': `https://${DAILY_BASE_URL}`,
      },
    });

    if (!rawResult.ok) {
      return res.status(400).json({
        message:
          'Unable to retrieve data from the provided url, please double check',
      });
    }

    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        dailyDevRss: rss,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({ success: true });
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
