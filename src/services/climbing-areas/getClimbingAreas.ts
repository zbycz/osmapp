import { fetchJson } from '../fetch';
import { getOverpassUrl } from '../overpassSearch';

/*
This query doesn't work, because area is usualy a relation of realtions,
which doesn't hold a center point in overpass:

  [out:json][timeout:300];
  ( area["ISO3166-1"="CZ"][admin_level=2]; )->.a;
  rel["climbing"="area"](area.a);
  out body;
*/

export const getClimbingAreas = async () => {
  const query = `[out:json][timeout:300]; rel["climbing"="area"]; out body;`;

  const areas = await fetchJson(getOverpassUrl(query));
  return areas?.elements;
};
