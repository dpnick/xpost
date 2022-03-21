import { Prisma } from '@prisma/client';

const handlePrismaError = (
  error: Prisma.PrismaClientKnownRequestError
): string => {
  let message = error.message;
  if (error.code === 'P2002') {
    // wait for https://github.com/prisma/prisma/issues/10829 to be resolved
    message = 'A similar record already exists.';
    const meta = error?.meta as { target: string[] };
    if (meta?.target && meta?.target[0]) {
      message = `${meta.target[0]} is already used.`;
    }
  }
  return message;
};

export default handlePrismaError;
