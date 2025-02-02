import { getClient } from './db';
import { tileToBBOX } from './tileToBBOX';
import { Tile } from '../../types';
import { optimizeGeojsonToGrid } from './optimizeGeojsonToGrid';

const logCacheMiss = (duration: number, count: number) => {
  console.log(`climbing_tiles_cache MISS ${duration}ms ${count}`); //eslint-disable-line no-console
};
const logCacheHit = (start: number) => {
  const duration = Math.round(performance.now() - start);
  console.log(`climbing_tiles_cache HIT ${duration}ms`); //eslint-disable-line no-console
};

const ZOOM_LEVELS = [0, 6, 9, 12];

export const getClimbingTile = async ({ z, x, y }: Tile) => {
  const start = performance.now();
  const client = await getClient();
  const isOptimized = z >= 9;
  const hasRoutes = z == 12;
  if (!ZOOM_LEVELS.includes(z)) {
    throw new Error('Zoom level not available');
  }

  const cache = await client.query(
    `SELECT tile_geojson FROM climbing_tiles_cache WHERE z = ${z} AND x = ${x} AND y = ${y}`,
  );
  if (cache.rowCount > 0) {
    logCacheHit(start);
    return cache.rows[0].tile_geojson as string;
  }

  const bbox = tileToBBOX({ z, x, y });
  const bboxCondition = `lon >= ${bbox[0]} AND lon <= ${bbox[2]} AND lat >= ${bbox[1]} AND lat <= ${bbox[3]}`;
  const query = hasRoutes
    ? `SELECT geojson FROM climbing_features WHERE type IN ('group', 'route') AND ${bboxCondition}`
    : `SELECT geojson FROM climbing_features WHERE type = 'group' AND ${bboxCondition}`;
  const result = await client.query(query);
  const allGeojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: result.rows.map((record) => record.geojson),
  };
  const geojson = isOptimized
    ? optimizeGeojsonToGrid(allGeojson, bbox)
    : allGeojson;

  const duration = Math.round(performance.now() - start);
  logCacheMiss(duration, geojson.features.length);

  // intentionally not awaited to make quicker return of data
  client.query(
    `INSERT INTO climbing_tiles_cache VALUES (${z}, ${x}, ${y}, $1, $2, $3) ON CONFLICT (z, x, y) DO NOTHING`,
    [geojson, duration, geojson.features.length],
  );

  return JSON.stringify(geojson);
};
