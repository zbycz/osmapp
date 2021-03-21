import { getApiId } from './helpers';
import { isBrowser } from '../components/helpers';
import { fetchText } from './fetch';
import { Feature } from './types';
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

  const response = await fetchText(url, { putInAbortableQueue: true });
  return osmToGeojson(response);
};

export const fetchFromApi = async (osmApiId) => {
  try {
    const feature = await getFeatureFromApi(osmApiId);
    if (isBrowser()) {
      console.log('fetched feature', feature); // eslint-disable-line no-console
    }
    return feature;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e);
    return null; // TODO show some user error message
  }
};
