import { fetchJson } from '../fetch';
import { getOverpassUrl } from '../overpassSearch';
import { LonLat, OsmId } from '../types';

export const fetchOverpassCenter = async ({
  type,
  id,
}: OsmId): Promise<LonLat | false> => {
  if (type === 'relation') {
    const query = `[out:json][timeout:1];(rel(${id});rel(r););nw(r);make stat ::geom=center(hull(gcat(geom())));out geom;`; // gets center also for relation of relations, https://github.com/drolbr/Overpass-API/issues/733
    const response = await fetchJson(getOverpassUrl(query));
    const [lon, lat] = response?.elements?.[0]?.geometry?.coordinates ?? [];
    return lon && lat ? [lon, lat] : false;
  }

  if (type === 'way') {
    const query = `[out:json][timeout:1];way(${id});out 1 ids qt center;`;
    const response = await fetchJson(getOverpassUrl(query));
    const { lat, lon } = response?.elements?.[0]?.center ?? {};
    return lon && lat ? [lon, lat] : false;
  }

  const query = `[out:json][timeout:1];node(${id});out 1 ids qt center;`;
  const response = await fetchJson(getOverpassUrl(query));
  const { lat, lon } = response?.elements?.[0] ?? {};
  return lon && lat ? [lon, lat] : false;
};
