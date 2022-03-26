import { handlePrismaError } from '@lib/prisma';
import { Prisma } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
import { addMinutes } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const key = req.headers.authorization?.split(' ')[1];
    if (key && key === process.env.SCHEDULED_KEY) {
      // event are dispatched at 55 to avoid high load times
      const time = addMinutes(new Date(), 5);
      console.log(time);
      console.log(time.toUTCString());
      // find scheduled posts to this time
      return res.status(200).json({ success: true });
    }
    return res.status(401).json({ message: 'Missing permission' });
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
