import type { NextApiRequest, NextApiResponse } from 'next';
import { xataRestQuery } from '../../../src/server/climbing-tiles/db';
import { serverFetchOsmUser } from '../../../src/server/osmApiAuthServer';
import { OSM_TOKEN_COOKIE } from '../../../src/services/osm/consts';

const deleteTick = async (req: NextApiRequest) => {
  const user = await serverFetchOsmUser(req.cookies[OSM_TOKEN_COOKIE]);
  const tick = await xataRestQuery(
    'SELECT "osmUserId" FROM climbing_ticks WHERE id=$1',
    [req.query.id],
  );

  if (!tick) {
    throw new Error('Tick not found');
  }

  if (tick.records[0].osmUserId !== user.id) {
    throw new Error('This tick is owned by different user.');
  }

  return await xataRestQuery('DELETE FROM climbing_ticks WHERE id=$1', [
    req.query.id,
  ]);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'DELETE') {
    res.status(400).send('Only DELETE method allowed.');
  }

  try {
    const result = await deleteTick(req);
    res.status(200).setHeader('Content-Type', 'application/json').send(result);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(500).send(String(err));
  }
};
