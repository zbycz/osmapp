import { getApiId, getShortId, getUrlOsmId, prod } from './helpers';
import { FetchError, fetchJson } from './fetch';
import { Feature, Position } from './types';
import { removeFetchCache } from './fetchCache';
import { overpassAroundToSkeletons } from './overpassAroundToSkeletons';
import { getPoiClass } from './getPoiClass';
import { isBrowser } from '../components/helpers';

const getOsmUrl = ({ type, id }) =>
  `https://www.openstreetmap.org/api/0.6/${type}/${id}.json`;

// Overpass API is used only for getting cetroids of ways and relations
const getOverpassUrl = ({ type, id }) => {
  const queries = {
    way: (wId) => `[out:json][timeout:1];way(${wId});out 1 ids qt center;`,
    relation: (rId) => `[out:json][timeout:1];rel(${rId});out 1 ids qt center;`,
  };
  return `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
    queries[type](id),
  )}`;
};

const getOsmPromise = (apiId) => fetchJson(getOsmUrl(apiId)); // TODO 504 gateway busy

// we should probably store just the last one, but this cant get too big, right?
const featureCenterCache = {};
export const addCenterFromMapToCache = (shortId, center) => {
  featureCenterCache[shortId] = center;
};

const getCenterPromise = async (apiId) => {
  if (apiId.type === 'node') return false;

  if (isBrowser()) {
    return featureCenterCache[getShortId(apiId)];
  }

  try {
    const overpass = await fetchJson(getOverpassUrl(apiId));
    const { lat, lon } = overpass?.elements?.[0]?.center ?? {};
    return [lon, lat];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e); // eg. 529 too many requests
    return false;
  }
};

export const clearFeatureCache = (apiId) => {
  const url = getOsmUrl(apiId);
  removeFetchCache(url); // watch out, must be same as above
};

const osmToFeature = (osm) => {
  const element = osm?.elements?.[0] ?? {};
  const { tags, lat, lon, nodes, members, ...osmMeta } = element;
  return {
    type: 'Feature' as const,
    geometry: undefined,
    center: lat ? [lon, lat] : undefined,
    osmMeta,
    tags,
    members,
    properties: getPoiClass(tags),
  };
};

export const fetchFeature = async (shortId): Promise<Feature> => {
  if (!shortId) {
    return null;
  }

  try {
    const apiId = getApiId(shortId);
    const [osmItem, center] = await Promise.all([
      getOsmPromise(apiId),
      getCenterPromise(apiId),
    ]);

    const feature = osmToFeature(osmItem);
    if (center) {
      feature.center = center;
    }

    return feature;
  } catch (e) {
    console.error(`fetchFeature(${shortId}):`, e); // eslint-disable-line no-console

    const error = e instanceof FetchError ? e.code : 'unknown';
    return {
      type: 'Feature',
      skeleton: true,
      nonOsmObject: false,
      osmMeta: getApiId(shortId),
      center: undefined,
      tags: { name: getUrlOsmId(getApiId(shortId)) },
      properties: { class: '', subclass: '' },
      error,
    };
  }
};

export const insertOsmNote = async (point: Position, text: string) => {
  const [lon, lat] = point;

  const body = new URLSearchParams();
  body.append('lat', `${lat}`);
  body.append('lon', `${lon}`);
  body.append('text', text);

  const osmUrl = prod
    ? 'https://www.openstreetmap.org'
    : 'https://master.apis.dev.openstreetmap.org';

  // {"type":"Feature","geometry":{"type":"Point","coordinates":[14.3244982,50.0927863]},"properties":{"id":26569,"url":"https://master.apis.dev.openstreetmap.org/api/0.6/notes/26569.json","comment_url":"https://master.apis.dev.openstreetmap.org/api/0.6/notes/26569/comment.json","close_url":"https://master.apis.dev.openstreetmap.org/api/0.6/notes/26569/close.json","date_created":"2021-04-17 10:37:44 UTC","status":"open","comments":[{"date":"2021-04-17 10:37:44 UTC","action":"opened","text":"way/39695868! Place was marked permanently closed.From https://osmapp.org/way/39695868","html":"\u003cp\u003eway/39695868! Place was marked permanently closed.From \u003ca href=\"https://osmapp.org/way/39695868\" rel=\"nofollow noopener noreferrer\"\u003ehttps://osmapp.org/way/39695868\u003c/a\u003e\u003c/p\u003e"}]}}
  const reply = await fetchJson(`${osmUrl}/api/0.6/notes.json`, {
    nocache: true,
    method: 'POST',
    body,
  });

  const noteId = reply.properties.id;
  return {
    type: 'note',
    text,
    url: `${prod ? 'https://osm.org' : osmUrl}/note/${noteId}`,
  };
};

const getAroundUrl = ([lat, lon]: Position) => {
  const point = `${lon},${lat}`;
  const types = ['place_of_worship', 'public_transport', 'amenity', 'shop'];
  const contentQuery = types.map(
    (type) => `
      relation["${type}"](around:50,${point});
      way["${type}"](around:50,${point});
      node["${type}"](around:50,${point});
      `,
  );
  return `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
    `[timeout:5][out:json];(${contentQuery.join('')});out 10 body qt center;`,
  )}`;
};

export const fetchAroundFeature = async (point: Position) => {
  const url = getAroundUrl(point);
  const response = await fetchJson(url);

  const around = overpassAroundToSkeletons(response);
  console.log({ around }); // eslint-disable-line no-console
  return around;
};
