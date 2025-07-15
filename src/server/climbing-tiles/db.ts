import { Client } from 'pg';
import { CTFeature } from '../../types';
import { fetchJson } from '../../services/fetch';

export type ClimbingFeaturesRecords = {
  type: string;
  osmType: string;
  osmId: number;
  name: string;
  nameRaw: string;
  count: number;
  lon: number;
  lat: number;
  geojson: CTFeature;
}[];

if (!global.db) {
  global.db = { pool: false };
}

const XATA_DATABASE = 'osmapp_db:main';
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

type SQLResponseJSON = {
  columns: { name: string; type: string }[];
  //total: number; // usually not present ???
  warning?: string;
  records: Record<string, any>[];
};
export const xataRestQuery = async (statement: string, params?: any[]) => {
  const headers = {
    Authorization: `Bearer ${process.env.XATA_PASSWORD}`,
    'Content-Type': 'application/json',
  };
  const result = await fetchJson<SQLResponseJSON>(XATA_REST_URL, {
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

export const xataRestQueryPaginated = async (
  statement: string,
  params?: any[],
) => {
  const LIMIT = 1000;

  let offset = 0;
  let allRecords: any[] = [];
  let hasMore = true;

  while (hasMore) {
    const paginatedStatement = `${statement} LIMIT ${LIMIT} OFFSET ${offset}`;
    console.log(`Executing paginated query: ${paginatedStatement}`); //eslint-disable-line no-console
    const result = await xataRestQuery(paginatedStatement, params);

    allRecords = allRecords.concat(result.records);
    if (result.records.length >= LIMIT) {
      offset += LIMIT;
    } else {
      hasMore = false;
    }
  }

  return allRecords;
};
