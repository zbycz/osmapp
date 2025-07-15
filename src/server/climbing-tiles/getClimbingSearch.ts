import { xataRestQuery } from './db';
import { ClimbingSearchResponse } from '../../types';

export const getClimbingSearch = async (
  q: string,
  lon: number,
  lat: number,
): Promise<ClimbingSearchResponse> => {
  const query = `
      SELECT "type", "lon", "lat", "osmType", "osmId", "name",
          acos(
            cos(radians($1)) * cos(radians(lat)) *
            cos(radians(lon) - radians($2)) +
            sin(radians($1)) * sin(radians(lat))
          ) AS distance -- for km multiply by 6378
      FROM climbing_features
      WHERE type != 'route' AND "nameRaw" ILIKE $3
      ORDER BY distance
      LIMIT 30`;
  const result = await xataRestQuery(query, [lon, lat, `%${q}%`]);

  if (result.records.length === 0) {
    throw new Error('No row found in climbing_tiles_stats');
  }

  return result.records as ClimbingSearchResponse;
};
