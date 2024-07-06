import { fetchJson } from '../fetch';

const getOverpassUrl = (query) =>
  `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

export const fetchOverpassCenter = async ({ type, id }) => {
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

  return false; // node has position from the osm query
};
