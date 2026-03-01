import type { NextApiRequest, NextApiResponse } from 'next';
import { serverFetchOsmUser } from '../../../src/server/osmApiAuthServer';
import { OSM_TOKEN_COOKIE } from '../../../src/services/osm/consts';
import { ClimbingTickDb } from '../../../src/types';
import { getDb } from '../../../src/server/db/db';

class HttpError extends Error {
  constructor(
    public message: string = '',
    public code: number,
  ) {
    super();
  }
}

const validateRequestAndGetTick = async (req: NextApiRequest) => {
  const user = await serverFetchOsmUser(req.cookies[OSM_TOKEN_COOKIE]);

  const tick = getDb()
    .prepare<
      [string],
      ClimbingTickDb
    >('SELECT id, osmUserId FROM climbing_ticks WHERE id = ?')
    .get(`${req.query.id}`);

  if (!tick) {
    throw new HttpError('Tick not found', 404);
  }

  if (tick.osmUserId !== user.id) {
    throw new HttpError('This tick is owned by different user.', 401);
  }

  return tick.id;
};

const deleteTick = async (req: NextApiRequest) => {
  const tickId = await validateRequestAndGetTick(req);
  return getDb().prepare('DELETE FROM climbing_ticks WHERE id = ?').run(tickId);
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

const getSafeUpdates = (req: NextApiRequest) => {
  const entries = ALLOWED_FIELDS.map(
    (field) => [field, req.body[field]] as [string, string | number],
  );
  const filtered = entries.filter(([k, v]) => v !== undefined); // careful - empty string or a zero are valid values!!
  return Object.fromEntries(filtered);
};

const updateTick = async (req: NextApiRequest) => {
  const tickId = await validateRequestAndGetTick(req);
  const updates = getSafeUpdates(req);
  if (updates.length === 0) {
    return;
  }

  const setClause = Object.keys(updates)
    .map((k) => `"${k}" = @${k}`)
    .join(', ');

  return getDb()
    .prepare(
      `UPDATE climbing_ticks SET ${setClause} WHERE id = @tickId RETURNING *`,
    )
    .get({ ...updates, tickId });
};

const performPutOrDelete = async (req: NextApiRequest) => {
  if (req.method === 'PUT') {
    return await updateTick(req);
  }
  if (req.method === 'DELETE') {
    return await deleteTick(req);
  }
  throw new Error('Method not implemented.');
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await performPutOrDelete(req);
    res.status(200).setHeader('Content-Type', 'application/json').send(result);
  } catch (err) {
    if (err instanceof HttpError) {
      res.status(err.code).send(err.message);
    } else {
      console.error(err); // eslint-disable-line no-console
      res.status(500).send(String(err));
    }
  }
};
