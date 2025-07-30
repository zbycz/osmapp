import {
  ClimbingFeaturesRecord,
  getClient,
  xataRestQuery,
  xataRestQueryPaginated,
} from './db';
import { tileToBBOX } from './tileToBBOX';
import { Tile } from '../../types';
import { buildTileGeojson } from './buildTileGeojson';
import { BBox } from 'geojson';

const getBboxCondition = (bbox: BBox) =>
  `lon >= ${bbox[0]} AND lon <= ${bbox[2]} AND lat >= ${bbox[1]} AND lat <= ${bbox[3]}`;

const logCacheMiss = (duration: number, count: number) =>
  console.log(`climbing_tiles_cache MISS ${duration}ms ${count}`); //eslint-disable-line no-console

const logCacheHit = (start: number) => {
  const duration = Math.round(performance.now() - start);
  console.log(`climbing_tiles_cache HIT ${duration}ms`); //eslint-disable-line no-console
};

const ZOOM_LEVELS = [0, 6, 9, 12]; // the zoom level is fetched, when Map reaches zoom+1, see climbingTilesSource.ts

export const getClimbingTile = async ({ z, x, y }: Tile) => {
  const start = performance.now();
  const isOptimizedToGrid = z <= 6;
  const hasRoutes = z == 12;
  if (!ZOOM_LEVELS.includes(z)) {
    throw new Error('Zoom level not available');
  }

  const cacheKey = `${z}/${x}/${y}`;
  const cache = await xataRestQuery(
    'SELECT tile_geojson FROM climbing_tiles_cache WHERE zxy = $1',
    [cacheKey],
  );
  if (cache.records.length > 0) {
    logCacheHit(start);
    return cache.records[0].tile_geojson as string;
  }

  const bbox = tileToBBOX({ z, x, y });
  const bboxCondition = getBboxCondition(bbox);
  const query = hasRoutes
    ? `SELECT * FROM climbing_features WHERE ${bboxCondition}`
    : `SELECT * FROM climbing_features WHERE type != 'route' AND ${bboxCondition}`;

  const records = await xataRestQueryPaginated<ClimbingFeaturesRecord>(query);
  const geojson = buildTileGeojson(isOptimizedToGrid, records, bbox);

  const duration = Math.round(performance.now() - start);
  logCacheMiss(duration, geojson.features.length);

  await xataRestQuery(
    `INSERT INTO climbing_tiles_cache VALUES ($1, $2, $3, $4) ON CONFLICT (zxy) DO NOTHING`,
    [cacheKey, JSON.stringify(geojson), duration, geojson.features.length],
  );

  return JSON.stringify(geojson);
};

export const cacheTile000 = async (records: ClimbingFeaturesRecord[]) => {
  const bbox = tileToBBOX({ z: 0, x: 0, y: 0 });
  const tile000 = buildTileGeojson(true, records, bbox);

  const client = await getClient();
  await client.query(
    `INSERT INTO climbing_tiles_cache VALUES ('0/0/0', $1, -1, -1)`,
    [tile000],
  );
};
