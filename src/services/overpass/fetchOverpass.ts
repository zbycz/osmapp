import { fetchJson } from '../fetch';

// TODO add proper overpass types from refreshClimbingTilesHelpers.ts

export const fetchOverpass = async (fullQuery: string) =>
  await fetchJson(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      fullQuery,
    )}`,
  );
