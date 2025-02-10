import { getClient } from './db';
import { ClimbingStatsResponse } from '../../types';

export const getClimbingStats = async (): Promise<ClimbingStatsResponse> => {
  // return {
  //   "lastRefresh": "2025-02-10T15:23:37.283Z",
  //   "osmDataTimestamp": "2024-11-26T08:17:27Z",
  //   "devStats": {
  //     "id": 37,
  //     "build_duration": "12942",
  //     "max_size": null,
  //     "max_size_zxy": null,
  //     "max_time": null,
  //     "max_time_zxy": null
  //   },
  //   "groupsCount": 6518,
  //   "groupsWithNameCount": 6422,
  //   "routesCount": 14777
  // };

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
