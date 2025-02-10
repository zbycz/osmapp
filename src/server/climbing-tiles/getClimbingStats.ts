import { getClient } from './db';

const query = `SELECT * FROM climbing_tiles_stats LIMIT 1`;

export const getClimbingStats = async () => {
  const client = await getClient();
  const result = await client.query(query);

  if (result.rowCount === 0) {
    throw new Error('No row found in climbing_tiles_stats');
  }

  const row = result.rows[0];

  return JSON.stringify({
    lastRefresh: row.timestamp,
    osmTimestamp: row.osm_data_timestamp,
    devStats: JSON.stringify(row, null, 2),
    groupsCount: row.groups_count,
    groupsWithNameCount: row.groups_with_name_count,
    routesCount: row.routes_count,
  });
};
