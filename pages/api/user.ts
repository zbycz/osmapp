import type { NextApiRequest, NextApiResponse } from 'next';
import { serverFetchOsmUser } from '../../src/server/osmApiAuthServer';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await serverFetchOsmUser(req.cookies.osmAccessToken);

    res.status(200).json({ user });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
