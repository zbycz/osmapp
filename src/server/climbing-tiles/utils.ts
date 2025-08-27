import { PoolClient } from 'pg';
import { ClimbingFeaturesRecord } from './db';
import format from 'pg-format';
import { OsmResponse } from './overpass/types';

type TileStats =
  | {}
  | {
      max_time_zxy: string;
      max_size_zxy: string;
      max_time: string;
      max_size: string;
    };

export const queryTileStats = async (
  client: PoolClient,
): Promise<TileStats> => {
  const time = await client.query(
    'SELECT zxy, duration FROM climbing_tiles_cache ORDER BY duration DESC LIMIT 1',
  );
  const size = await client.query(
    'SELECT zxy, LENGTH(tile_geojson) AS size FROM climbing_tiles_cache ORDER BY size DESC LIMIT 1',
  );

  if (!time.rowCount || !size.rowCount) {
    return {};
  }

  return {
    max_time: time.rows[0].duration,
    max_time_zxy: time.rows[0].zxy,
    max_size: size.rows[0].size,
    max_size_zxy: size.rows[0].zxy,
  };
};

export const addStats = async (
  client: PoolClient,
  data: OsmResponse,
  buildLog: string,
  buildDuration: number,
  deletedTilesStats: TileStats,
  records: ClimbingFeaturesRecord[],
) => {
  const groups = records.filter((r) => ['crag', 'area'].includes(r.type));
  const routes = records.filter((r) => r.type === 'route');

  const statsRow = {
    timestamp: new Date().toISOString(),
    osm_data_timestamp: data.osm3s.timestamp_osm_base,
    build_log: buildLog,
    build_duration: buildDuration,
    ...deletedTilesStats,
    routes_count: routes.length,
    groups_count: groups.length,
    groups_with_name_count: groups.filter((r) => r.name).length,
  };

  await client.query(
    format(
      'INSERT INTO climbing_tiles_stats(%I) VALUES (%L)',
      Object.keys(statsRow),
      Object.values(statsRow),
    ),
  );
};

export const removeDiacritics = (str: string) =>
  str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
