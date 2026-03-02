import { ClimbingSearchRecord } from '../../types';
import { removeDiacritics } from './utils';
import { getDb } from '../db/db';
import { LonLat } from '../../services/types';

const EARTH_RADIUS = 6372795;

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

const getDistance = (point1: LonLat, point2: LonLat) => {
  const latdiff = degreesToRadians(point2[1]) - degreesToRadians(point1[1]);
  const lngdiff = degreesToRadians(point2[0]) - degreesToRadians(point1[0]);

  // harvesine formula
  return (
    EARTH_RADIUS *
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin(latdiff / 2) ** 2 +
          Math.cos(degreesToRadians(point1[1])) *
            Math.cos(degreesToRadians(point2[1])) *
            Math.sin(lngdiff / 2) ** 2,
      ),
    )
  );
};

const haversineSorter = (origin: LonLat) => (a, b) =>
  getDistance(origin, [a.lon, a.lat]) - getDistance(origin, [b.lon, b.lat]);

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

  return rows.sort(haversineSorter([lon, lat]));
};
