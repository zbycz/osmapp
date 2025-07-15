import { xataRestQuery } from './db';
import { ClimbingSearchRecord } from '../../types';
import { removeDiacritics } from './utils';

export const getClimbingSearch = async (
  q: string,
  lon: number,
  lat: number,
): Promise<ClimbingSearchRecord[]> => {
  const query = `
      SELECT "type", "lon", "lat", "osmType", "osmId", "name",
          acos(
            cos(radians($1)) * cos(radians(lat)) *
            cos(radians(lon) - radians($2)) +
            sin(radians($1)) * sin(radians(lat))
          )*6378 AS distance_km
      FROM climbing_features
      WHERE type != 'route' AND "nameRaw" ILIKE $3
      ORDER BY distance_km
      LIMIT 30`;

  const result = await xataRestQuery(query, [
    lat,
    lon,
    `%${removeDiacritics(q)}%`,
  ]);

  return result.records as ClimbingSearchRecord[];
};
