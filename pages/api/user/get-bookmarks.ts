import { handlePrismaError, prisma } from '@lib/prisma';
import { DailyDevItem } from '@models/dailyDevItem';
import { Prisma } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
import { XMLParser } from 'fast-xml-parser';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { DAILY_BASE_URL } from 'pages/dashboard/inspirations';

const parser = new XMLParser();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  try {
    const email = session.user!.email ?? undefined;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (!user?.dailyDevRss) {
      return res.status(404).json({
        message: 'Missing RSS url',
      });
    }

    const raw = await fetch(user.dailyDevRss, {
      headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': `https://${DAILY_BASE_URL}`,
      },
    });
    const text = await raw.text();
    const { rss } = parser.parse(text);

    const {
      channel: { item },
    }: { channel: { item: DailyDevItem[] } } = rss;

    const tags = item.map(({ category }) => category).flat();
    const uniqueTags = tags.filter(
      (value, index) => !!value && tags.indexOf(value) === index
    );

    return res.status(200).json({ bookmarks: item, tags: uniqueTags });
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
