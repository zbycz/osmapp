import { ClimbingStatsResponse } from '../../types';
import { getPool } from './db';

export const getClimbingStats = async (): Promise<ClimbingStatsResponse> => {
  const query = `SELECT * FROM climbing_tiles_stats ORDER BY id DESC LIMIT 1`;
  const result = await getPool().query(query);

  if (result.rows.length === 0) {
    throw new Error('No row found in climbing_tiles_stats');
  }

  const {
    timestamp,
    osm_data_timestamp,
    groups_count,
    groups_with_name_count,
    routes_count,
    build_log, // only in db
    ...devStats
  } = result.rows[0];

  return {
    lastRefresh: timestamp,
    osmDataTimestamp: osm_data_timestamp,
    devStats,
    groupsCount: groups_count,
    groupsWithNameCount: groups_with_name_count,
    routesCount: routes_count,
  };
};
