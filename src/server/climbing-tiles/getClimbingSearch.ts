import { ClimbingSearchRecord } from '../../types';
import { removeDiacritics } from './utils';
import { getDb } from '../db/db';

export const getClimbingSearch = (
  q: string,
  lon: number,
  lat: number,
): ClimbingSearchRecord[] => {
  const query = `
    SELECT "type", "lon", "lat", "osmType", "osmId", COALESCE("name", "nameRaw") AS "name",
      ((lat - @lat) * (lat - @lat) + (lon - @lon) * (lon - @lon)) AS distance_sq
    FROM climbing_features
    WHERE type != 'route' AND nameRaw LIKE @query
    ORDER BY distance_sq
    LIMIT 30`;

  const rows = getDb()
    .prepare(query)
    .all({
      lat,
      lon,
      query: `%${removeDiacritics(q)}%`,
    }) as ClimbingSearchRecord[];

  return rows;
};
