import { getClient } from './db';
import { ClimbingStatsResponse } from '../../types';

export const getClimbingStats = async (): Promise<ClimbingStatsResponse> => {
  const client = await getClient();
  const query = `SELECT * FROM climbing_tiles_stats ORDER BY id DESC LIMIT 1`;
  const result = await client.query(query);

  if (result.rowCount === 0) {
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
