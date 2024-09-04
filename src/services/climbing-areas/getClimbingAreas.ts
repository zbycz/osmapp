import { fetchJson } from '../fetch';
import { getOverpassUrl } from '../overpassSearch';

export const getClimbingAreas = async () => {
  const query = `[out:json][timeout:300]; rel["climbing"="area"]; out body;`;

  const areas = await fetchJson(getOverpassUrl(query));
  return areas?.elements;
};
