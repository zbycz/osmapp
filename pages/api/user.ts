import type { NextApiRequest, NextApiResponse } from 'next';
import { serverFetchOsmUser } from '../../src/server/osmApiAuthServer';
import { OSM_TOKEN_COOKIE } from '../../src/services/osm/consts';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await serverFetchOsmUser(req.cookies[OSM_TOKEN_COOKIE]);

    res.status(200).json({ user });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
