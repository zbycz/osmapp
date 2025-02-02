import { getClient } from './db';
import { tileToBBOX } from './tileToBBOX';
import { Tile } from '../../types';
import { optimizeGeojsonToGrid } from './optimizeGeojsonToGrid';

const TILES_CONFIG = {
  0: { optimized: true, routes: false },
  6: { optimized: true, routes: false },
  9: { optimized: false, routes: false },
  12: { optimized: false, routes: true },
};

export const getClimbingTile = async ({ z, x, y }: Tile) => {
  if (z > 12) {
    throw new Error('Zoom 12 is maximum (with all details)');
  }
  const isDetails = z == 12;

  const start = performance.now();

  const client = await getClient();

  const tile = await client.query(
    `SELECT tile_geojson FROM climbing_tiles_cache WHERE z = ${z} AND x = ${x} AND y = ${y}`,
  );
  if (tile.rowCount > 0) {
    console.log(
      'climbing_tiles_cache HIT',
      Math.round(performance.now() - start) + 'ms',
    );
    return tile.rows[0].tile_geojson;
  }

  const bbox = tileToBBOX({ z, x, y });
  const bboxCondition = `lon >= ${bbox[0]} AND lon <= ${bbox[2]} AND lat >= ${bbox[1]} AND lat <= ${bbox[3]}`;
  const query = isDetails
    ? `SELECT geojson FROM climbing_features WHERE type IN ('group', 'route') AND ${bboxCondition}`
    : `SELECT geojson FROM climbing_features WHERE type = 'group' AND ${bboxCondition}`;
  const result = await client.query(query);
  const geojson = {
    type: 'FeatureCollection',
    features: result.rows.map((record) => record.geojson),
  } as GeoJSON.FeatureCollection;

  console.log(
    'climbing_tiles_cache MISS',
    Math.round(performance.now() - start) + 'ms',
    result.rows.length,
  );

  const optimizedGeojson =
    z >= 9 ? geojson : optimizeGeojsonToGrid(geojson, bbox);

  client.query(
    `INSERT INTO climbing_tiles_cache VALUES (${z}, ${x}, ${y}, $1) ON CONFLICT (z, x, y) DO NOTHING`,
    [optimizedGeojson],
  );

  return JSON.stringify(optimizedGeojson);
};
