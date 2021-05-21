import { getApiId, getUrlOsmId, OsmApiId, prod } from './helpers';
import { FetchError, fetchJson, fetchText } from './fetch';
import { Feature, Position } from './types';
import { osmToGeojson } from './osmToGeojson';
import { removeFetchCache } from './fetchCache';
import { overpassAroundToSkeletons } from './overpassAroundToSkeletons';

export const OSM_API = 'https://www.openstreetmap.org/api/0.6';
export const OSM_FEATURE_URL = ({ type, id }) => `${OSM_API}/${type}/${id}`;

// https://wiki.openstreetmap.org/wiki/Overpass_API
export const OP_API = 'https://overpass-api.de/api/interpreter?data=';
export const OP_URL = (query) => OP_API + encodeURIComponent(query);
export const OP_QUERY = {
  node: (id) => `node(${id});out;`,
  way: (id) => `way(${id});(._;>;);out;`,
  relation: (id) => `rel(${id});(._;>;);out;`,
};
export const OP_FEATURE_URL = ({ type, id }) => OP_URL(OP_QUERY[type](id));

const FETCH_FEATURE_URL = (apiId) =>
  apiId.type === 'node' ? OSM_FEATURE_URL(apiId) : OP_FEATURE_URL(apiId);

export const getFeatureFromApi = async (shortId): Promise<Feature> => {
  const apiId = getApiId(shortId);
  const url = FETCH_FEATURE_URL(apiId);
  const response = await fetchText(url, { putInAbortableQueue: true }); // TODO 504 gateway busy
  return osmToGeojson(response);
};

export const clearFeatureCache = (apiId: OsmApiId) => {
  const url = FETCH_FEATURE_URL(apiId);
  removeFetchCache(url, { putInAbortableQueue: true }); // watch out, must be same as above
};

export const fetchInitialFeature = async (shortId): Promise<Feature> => {
  try {
    return shortId ? await getFeatureFromApi(shortId) : null;
  } catch (e) {
    const error = e instanceof FetchError ? e.code : 'unknown';

    console.error(`Feature id=${shortId}:`, e); // eslint-disable-line no-console

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

export const OVERPASS_AROUND_URL = ([lat, lon]: Position) => {
  const point = `${lon},${lat}`;
  const types = ['place_of_worship', 'public_transport', 'amenity', 'shop'];
  const contentQuery = types.map(
    (type) => `
      relation["${type}"](around:50,${point});
      way["${type}"](around:50,${point});
      node["${type}"](around:50,${point});
      `,
  );
  return OP_URL(
    `[timeout:5][out:json];(${contentQuery.join('')});out 10 body qt center;`,
  );
};

export const fetchAroundFeature = async (point: Position) => {
  const url = OVERPASS_AROUND_URL(point);
  const response = await fetchJson(url);

  const around = overpassAroundToSkeletons(response);
  console.log({ around }); // eslint-disable-line no-console
  return around;
};
