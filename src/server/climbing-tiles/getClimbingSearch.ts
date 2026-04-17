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

const QUERY_GROUPS = `
    SELECT "type", "lon", "lat", "osmType", "osmId", COALESCE("name", "nameRaw") AS "name",
      ((lat - @lat) * (lat - @lat) + (lon - @lon) * (lon - @lon)) AS distance_sq
    FROM climbing_features
    WHERE type != 'route' AND type != 'route_top' AND nameRaw LIKE @query
    ORDER BY distance_sq
    LIMIT 30`;

const QUERY_ROUTES = `
    SELECT "type", "lon", "lat", "osmType", "osmId", COALESCE("name", "nameRaw") AS "name",
      ((lat - @lat) * (lat - @lat) + (lon - @lon) * (lon - @lon)) AS distance_sq
    FROM climbing_features
    WHERE (type = 'route' OR type = 'route_top') AND nameRaw LIKE @query
    ORDER BY distance_sq
    LIMIT 10`;

// usually 20 ms on M1 Air for both queries (70k records, 59k with nameRaw)
export const getClimbingSearch = (
  q: string,
  lon: number,
  lat: number,
): ClimbingSearchRecord[] => {
  const query = `%${removeDiacritics(q)}%`;

  const groups = getDb()
    .prepare(QUERY_GROUPS)
    .all({ lat, lon, query }) as ClimbingSearchRecord[];
  const routes = getDb()
    .prepare(QUERY_ROUTES)
    .all({ lat, lon, query }) as ClimbingSearchRecord[];

  groups.sort(haversineSorter([lon, lat])); // we search by distance_sq for performance, but we want to sort by real distance on FE
  routes.sort(haversineSorter([lon, lat]));

  return [...groups, ...routes];
};
