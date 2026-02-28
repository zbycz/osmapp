import { ClimbingFeaturesRecord, getDb } from '../db/db';
import { OsmResponse } from './overpass/types';

type TileStats =
  | {}
  | {
      max_time_zxy: string;
      max_size_zxy: string;
      max_time: string;
      max_size: string;
    };

export const queryTileStats = (): TileStats => {
  const db = getDb();

  const time = db
    .prepare(
      'SELECT zxy, duration FROM climbing_tiles_cache ORDER BY duration DESC LIMIT 1',
    )
    .get() as any; // TODO any
  const size = db
    .prepare(
      'SELECT zxy, LENGTH(tile_geojson) AS size FROM climbing_tiles_cache ORDER BY size DESC LIMIT 1',
    )
    .get() as any;

  if (!time || !size) {
    return {};
  }

  return {
    max_time: time.duration,
    max_time_zxy: time.zxy,
    max_size: size.size,
    max_size_zxy: size.zxy,
  };
};

export const addStats = (
  data: OsmResponse,
  buildLog: string,
  buildDuration: number,
  deletedTilesStats: TileStats,
  records: ClimbingFeaturesRecord[],
) => {
  const db = getDb();

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

  const columns = Object.keys(statsRow).join(', ');
  const placeholders = Object.keys(statsRow)
    .map((key) => `@${key}`)
    .join(', ');
  db.prepare(
    `INSERT INTO climbing_tiles_stats (${columns}) VALUES (${placeholders})`,
  ).run(statsRow);
};

export const removeDiacritics = (str: string) =>
  str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
