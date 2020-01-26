// @flow

import { fetchText, getApiId, getCenter, parseXmlString } from './helpers';
import { getPoiClass } from './getPoiClass';

export const OSM_API = 'https://www.openstreetmap.org/api/0.6';
export const OSM_FEATURE_URL = ({ type, id }) => `${OSM_API}/${type}/${id}`;

// https://wiki.openstreetmap.org/wiki/Overpass_API
export const OP_API = 'https://overpass-api.de/api/interpreter?data=';
export const OP_URL = query => OP_API + encodeURIComponent(query);
export const OP_QUERY = {
  node: id => `node(${id});out;`,
  way: id => `way(${id});(._;>;);out;`,
  relation: id => `rel(${id});(._;>;);out;`,
};
export const OP_FEATURE_URL = ({ type, id }) => OP_URL(OP_QUERY[type](id));

// parse osm xml -> geojson
const coords = x => [parseFloat(x.$.lon), parseFloat(x.$.lat)];
const lookupNode = (osmXml, id) => osmXml.node.find(x => x.$.id === id);
const getGeometry = {
  node: (osmXml, node) => ({
    coordinates: coords(node),
  }),
  way: (osmXml, way) => ({
    type: 'LineString', // TODO Polygon
    coordinates: [way.nd.map(nd => coords(lookupNode(osmXml, nd.$.ref)))],
  }),
};

export const osmToGeojson = async osmXmlStr => {
  const osmXml = await parseXmlString(osmXmlStr);

  const type = osmXml.relation ? 'relation' : osmXml.way ? 'way' : 'node';
  const item = osmXml[type];
  if (!item) {
    throw 'Empty osmXml result';
  }

  const osmMeta = { type, ...item.$ };
  const tagItems = item.tag.length ? item.tag : [item.tag];
  const tags = tagItems.reduce(
    (acc, { $: { k, v } }) => ({ ...acc, [k]: v }),
    {},
  );

  return {
    type: 'Feature',
    geometry: getGeometry[type](osmXml, item),
    osmMeta,
    tags,
    properties: getPoiClass(tags),
  };
};

export const getFeatureFromApi = async featureId => {
  const apiId = getApiId(featureId);
  const isNode = apiId.type === 'node';
  const url = isNode ? OSM_FEATURE_URL(apiId) : OP_FEATURE_URL(apiId);

  const response = await fetchText(url, { putInAbortableQueue: true });
  const geojson = await osmToGeojson(response);
  console.log('fetched feature', geojson); // eslint-disable-line no-console
  return {
    ...geojson,
    center: getCenter(geojson),
  };
};

export const fetchFromApi = async function(osmApiId) {
  try {
    return await getFeatureFromApi(osmApiId);
  } catch (e) {
    console.warn(e);
  }
};
