import { Client } from 'pg';
import { ClimbingTilesFeature } from '../../types';
import { fetchJson } from '../../services/fetch';
import type { Polygon } from 'geojson';
import { GeometryCollection, LineString, OsmType } from '../../services/types';

export type ClimbingFeaturesRecord = {
  type: string;
  osmType: OsmType;
  osmId: number;
  lon: number;
  lat: number;
  name?: string;
  nameRaw: string;
  count?: number;
  hasImages?: boolean;
  gradeId?: number;
  line?: number[][];
};

if (!global.db) {
  global.db = { pool: false };
}

const XATA_DATABASE = `osmapp_db:${process.env.NEXT_PUBLIC_CLIMBING_TILES_LOCAL_BRANCH ?? 'main'}`;
const XATA_REST_URL = `https://osmapp-tvgiad.us-east-1.xata.sh/db/${XATA_DATABASE}/sql`;

export async function getClient(): Promise<Client> {
  if (!process.env.XATA_PASSWORD) {
    throw new Error('XATA_PASSWORD must be set');
  }

  if (!global.db.pool) {
    const client = new Client({
      user: 'tvgiad',
      password: process.env.XATA_PASSWORD,
      host: 'us-east-1.sql.xata.sh',
      port: 5432,
      database: XATA_DATABASE,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await client.connect();

    global.db.pool = client;
  }
  return global.db.pool;
}

export async function closeClient(client: Client): Promise<void> {
  await client.end();
  global.db.pool = false;
}

type SQLResponseJSON<T> = {
  columns: { name: string; type: string }[];
  //total: number; // present in some queries, but usually 0
  warning?: string;
  records: T[];
};
export const xataRestQuery = async <T = Record<string, any>>(
  statement: string,
  params?: any[],
) => {
  const headers = {
    Authorization: `Bearer ${process.env.XATA_PASSWORD}`,
    'Content-Type': 'application/json',
  };
  const result = await fetchJson<SQLResponseJSON<T>>(XATA_REST_URL, {
    nocache: true,
    headers,
    method: 'POST',
    body: JSON.stringify({
      statement: statement,
      params: params,
    }),
  });

  return result;
};

export const xataRestQueryPaginated = async <T = Record<string, any>>(
  statement: string,
  params?: any[],
) => {
  const LIMIT = 1000;

  let offset = 0;
  let allRecords: T[] = [];
  let hasMore = true;

  while (hasMore) {
    const paginatedStatement = `${statement} LIMIT ${LIMIT} OFFSET ${offset}`;
    console.log(`Executing paginated query: ${paginatedStatement}`); //eslint-disable-line no-console
    const result = await xataRestQuery<T>(paginatedStatement, params);

    allRecords = allRecords.concat(result.records);
    if (result.records.length >= LIMIT) {
      offset += LIMIT;
    } else {
      hasMore = false;
    }
  }

  return allRecords;
};

export const xataRestUpdate = async (
  sql: string,
  params: any[],
  allowedFields: string[],
  data: Record<string, any>, // unsafe user input
) => {
  const offset = params.length + 1;
  const setClause = allowedFields
    .filter((field) => data[field])
    .map((field, index) => `"${field}"=$${index + offset}`)
    .join(', ');
  const setParams = allowedFields
    .filter((field) => data[field])
    .map((field) => data[field]);

  const statement = sql.replace('...', setClause);
  return xataRestQuery(statement, [...params, ...setParams]);
};
