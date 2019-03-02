// @flow

import { fetchText, getApiId, parseXmlString } from './helpers';

export const API_URL = ({ type, id }) =>
  `https://www.openstreetmap.org/api/0.6/${type}/${id}`;
export const getApiUrl = shortId => API_URL(getApiId(shortId));

export const osmToGeojson = async osmXmlStr => {
  const osmXml = await parseXmlString(osmXmlStr);

  delete osmXml['$'];
  const type = Object.keys(osmXml)[0];
  const item = osmXml[type];
  const osmMeta = { type, ...item['$'] };
  const properties = item.tag.reduce(
    (acc, { $: { k, v } }) => ({ ...acc, [k]: v }),
    {},
  );

  return {
    geometry: {
      coordinates: [osmMeta.lon, osmMeta.lat],
    },
    osmMeta,
    properties,
  };
};

export const getFeatureFromApi = async shortId => {
  const url = getApiUrl(shortId);
  const response = await fetchText(url);
  const geojson = await osmToGeojson(response);
  console.log('fetched feature', geojson); // eslint-disable-line no-console
  return geojson;
};
