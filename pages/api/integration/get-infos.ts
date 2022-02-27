import providers from '@lib/providers';
import { Integration, Provider } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const integrations: (Integration & { provider: Provider })[] =
    req.body?.integrations;

  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  if (!integrations || integrations?.length < 1) {
    return res.status(422).json({
      message: 'Missing parameters',
    });
  }

  try {
    const promises = integrations.map((integration) =>
      providers[integration.provider!.name].getUserInfos(integration)
    );
    const result = await Promise.all(promises);

    console.log(result);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('[api] integration', error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

export default handler;
