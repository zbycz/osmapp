import { getApiId, getUrlOsmId, prod } from './helpers';
import { fetchJson, fetchText } from './fetch';
import { Feature, Position } from './types';
import { osmToGeojson } from './osmToGeojson';

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

export const getFeatureFromApi = async (featureId): Promise<Feature> => {
  const apiId = getApiId(featureId);
  const isNode = apiId.type === 'node';
  const url = isNode ? OSM_FEATURE_URL(apiId) : OP_FEATURE_URL(apiId);

  const response = await fetchText(url, { putInAbortableQueue: true }); // TODO 504 gateway busy
  return osmToGeojson(response);
};

export const fetchInitialFeature = async (id): Promise<Feature> => {
  try {
    return id ? await getFeatureFromApi(id) : null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`Fetch error while fetching id=${id}`, e.code);
    return {
      type: 'Feature',
      skeleton: true,
      nonOsmObject: false,
      osmMeta: getApiId(id),
      center: undefined,
      tags: { name: getUrlOsmId(getApiId(id)) },
      properties: { class: '', subclass: '' },
      error: 'gone',
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
