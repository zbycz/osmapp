import type { NextApiRequest, NextApiResponse } from 'next';
import {
  xataRestQuery,
  xataRestUpdate,
} from '../../../src/server/climbing-tiles/db';
import { serverFetchOsmUser } from '../../../src/server/osmApiAuthServer';
import { OSM_TOKEN_COOKIE } from '../../../src/services/osm/consts';
import { ClimbingTick } from '../../../src/types';

const validateTick = async (req: NextApiRequest) => {
  const user = await serverFetchOsmUser(req.cookies[OSM_TOKEN_COOKIE]);
  const tick = await xataRestQuery<ClimbingTick>(
    'SELECT id, "osmUserId" FROM climbing_ticks WHERE id=$1',
    [req.query.id],
  );

  if (tick?.records?.length === 0) {
    throw new Error('Tick not found');
  }

  if (tick.records[0].osmUserId !== user.id) {
    throw new Error('This tick is owned by different user.');
  }

  return tick.records[0].id;
};

const deleteTick = async (req: NextApiRequest) => {
  const tickId = await validateTick(req);
  return xataRestQuery('DELETE FROM climbing_ticks WHERE id=$1', [tickId]);
};

const ALLOWED_FIELDS = [
  'osmType',
  'osmId',
  'timestamp',
  'style',
  'myGrade',
  'note',
  'pairing',
];

const updateTick = async (req: NextApiRequest) => {
  const tickId = await validateTick(req);
  return xataRestUpdate(
    `UPDATE climbing_ticks SET ... WHERE id=$1`,
    [tickId],
    ALLOWED_FIELDS,
    req.body,
  );
};

const performPutOrDelete = async (req: NextApiRequest) => {
  if (req.method === 'PUT') {
    return updateTick(req);
  }
  if (req.method === 'DELETE') {
    return deleteTick(req);
  }
  throw new Error('Method not implemented.');
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await performPutOrDelete(req);
    res.status(200).setHeader('Content-Type', 'application/json').send(result);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(500).send(String(err));
  }
};
