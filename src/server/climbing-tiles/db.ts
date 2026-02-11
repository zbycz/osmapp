import { Pool, types } from 'pg';
import { OsmType } from '../../services/types';

export type ClimbingFeaturesRecord = {
  type: string;
  osmType: OsmType;
  osmId: number;
  lon: number;
  lat: number;
  name?: string;
  nameRaw: string;
  routeCount?: number;
  hasImages?: boolean;
  parentId?: number;
  gradeId?: number;
  gradeTxt?: string;
  line?: number[][];
  histogramCode?: string;
};

if (!global.db) {
  global.db = { pool: null as Pool | null };
}

types.setTypeParser(20, (val) => parseInt(val, 10));
types.setTypeParser(1700, (val) => parseFloat(val));

export function getPool(): Pool {
  if (!process.env.NEON_DB_URL) {
    throw new Error('NEON_DB_URL must be set');
  }

  if (!global.db.pool) {
    global.db.pool = new Pool({
      connectionString: process.env.NEON_DB_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }

  return global.db.pool;
}
