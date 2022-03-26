import { handlePrismaError } from '@lib/prisma';
import { Prisma } from '@prisma/client';
import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req);
  console.log(req.body);
  console.log(req.headers);
  try {
    const key = req.headers.authorization?.split(' ')[1];
    console.log(key);
    console.log(process.env.SCHEDULED_KEY);
    if (key && key === process.env.SCHEDULED_KEY) {
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
