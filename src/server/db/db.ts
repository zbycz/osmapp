import BetterSqlite3, { type Database } from 'better-sqlite3';
import { readFileSync } from 'fs';
import path from 'path';
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
  hasImages?: number; // sqlite doesn't have bool
  parentId?: number;
  gradeId?: number;
  gradeTxt?: string;
  line?: string; // JSON of type: number[][]
  histogramCode?: string;
};

const DB_PATH = path.resolve(process.cwd(), 'data/db.sqlite');
const SCHEMA_PATH = path.resolve(process.cwd(), 'src/server/db/schema.sql');

const getDbVersion = (db: Database) => {
  const result = db
    .prepare<[], { user_version: number }>('PRAGMA user_version')
    .get();
  return result.user_version;
};

// global to allow hot-reload in dev
const store = global as unknown as { db: Database | undefined };

export function getDb() {
  if (!store.db) {
    const db = new BetterSqlite3(DB_PATH);

    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');

    if (getDbVersion(db) === 0) {
      db.transaction(() => {
        db.exec(readFileSync(SCHEMA_PATH, 'utf8'));
        db.pragma('user_version = 1');
      })();

      console.log(`Database ${DB_PATH} initialized to version 1`); // eslint-disable-line no-console
    }

    store.db = db;
  }

  return store.db;
}

// TODO use global const DB - but develop a way to disable it, eg. for vercel
// currently throws TypeError: Cannot open database because the directory does not exist
//export const DB = getDb();
