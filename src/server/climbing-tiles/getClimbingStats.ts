import { getClient } from './db';

export const getClimbingStats = async () => {
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
    ...devStats
  } = result.rows[0];

  return JSON.stringify({
    lastRefresh: timestamp,
    osmDataTimestamp: osm_data_timestamp,
    devStats: JSON.stringify(devStats),
    groupsCount: groups_count,
    groupsWithNameCount: groups_with_name_count,
    routesCount: routes_count,
  });
};
