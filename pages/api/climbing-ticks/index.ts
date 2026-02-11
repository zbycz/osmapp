import type { NextApiRequest, NextApiResponse } from 'next';
import { getPool } from '../../../src/server/climbing-tiles/db';
import { serverFetchOsmUser } from '../../../src/server/osmApiAuthServer';
import { OSM_TOKEN_COOKIE } from '../../../src/services/osm/consts';
import format from 'pg-format';
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

  const insertResult = await getPool().query<ClimbingTickDb>(
    format(
      'INSERT INTO climbing_ticks (%I) VALUES (%L) RETURNING id',
      Object.keys(newTick),
      Object.values(newTick),
    ),
  );
  return insertResult.rows[0]?.id;
};

const getAllTicks = async (req: NextApiRequest) => {
  const user = await serverFetchOsmUser(req.cookies[OSM_TOKEN_COOKIE]);
  const result = await getPool().query<ClimbingTickDb>(
    'SELECT * FROM climbing_ticks WHERE "osmUserId" = $1',
    [user.id],
  );
  return result.rows;
};

const performGetOrPost = async (req: NextApiRequest) => {
  if (req.method === 'GET') {
    return getAllTicks(req);
  }
  if (req.method === 'POST') {
    return addTickToDB(req);
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
