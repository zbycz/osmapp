import { Client } from 'pg';

export type ClimbingFeaturesRecords = {
  type: string;
  osmType: string;
  osmId: number;
  name: string;
  count: number;
  lon: number;
  lat: number;
  geojson: string;
}[];

if (!global.db) {
  global.db = { pool: false };
}

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
      database: 'osmapp_db:main',
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
