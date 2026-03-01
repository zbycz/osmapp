import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../src/server/db/db';
import { serverFetchOsmUser } from '../../../src/server/osmApiAuthServer';
import { OSM_TOKEN_COOKIE } from '../../../src/services/osm/consts';
import { ClimbingTickDb } from '../../../src/types';

const addTickToDB = async (req: NextApiRequest) => {
  const user = await serverFetchOsmUser(req.cookies[OSM_TOKEN_COOKIE]);
  const { pairing, style, myGrade, osmType, osmId, note, timestamp } = req.body;

  const newTick: Omit<ClimbingTickDb, 'id'> = {
    osmUserId: user.id,
    osmType,
    osmId,
    timestamp,
    style,
    myGrade,
    note,
    pairing,
  };

  const columns = Object.keys(newTick);
  const columnNames = columns.map((c) => `"${c}"`).join(', ');
  const placeholders = columns.map((c) => `@${c}`).join(', ');

  const result = getDb()
    .prepare(
      `INSERT INTO climbing_ticks (${columnNames}) VALUES (${placeholders})`,
    )
    .run(newTick);

  return result.lastInsertRowid;
};

const getAllTicks = async (req: NextApiRequest) => {
  const user = await serverFetchOsmUser(req.cookies[OSM_TOKEN_COOKIE]);
  const statement = getDb().prepare<[number], ClimbingTickDb>(
    'SELECT * FROM climbing_ticks WHERE "osmUserId" = ?',
  );
  return statement.all(user.id);
};

const performGetOrPost = async (req: NextApiRequest) => {
  if (req.method === 'GET') {
    return await getAllTicks(req);
  }
  if (req.method === 'POST') {
    return await addTickToDB(req);
  }
  throw new Error('Method not implemented.');
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await performGetOrPost(req);
    res.status(200).setHeader('Content-Type', 'application/json').send(result);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(500).send(String(err));
  }
};
