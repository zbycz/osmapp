/* eslint no-undef:1 */
// @flow

import 'isomorphic-unfetch';

export const getApiId = shortId => {
  const type = { w: 'way', n: 'node', r: 'relation' }[shortId[0]];
  const id = shortId.substr(1);
  return { type, id };
};

export const getShortId = apiId => {
  if (typeof apiId === 'string') {
    return apiId.replace(/([a-z])[a-z]+\/([0-9]+)/, '$1$2');
  }
  return apiId.type[0] + apiId.id;
};

export const fetchXml = async url => {
  // TODO this.setState({ isLoading: false });
  const res = await fetch(url);

  if (!res.ok || res.status < 200 || res.status >= 300) {
    const data = await res.text();
    throw new Error(
      `Fetch: ${res.status} ${res.statusText} ${res.url} Data: ${data}`,
    );
  }

  const xmlStr = await res.text();
  const parser = new window.DOMParser();
  return parser.parseFromString(xmlStr, 'text/xml');
};

export const fetchElement = shortId => {
  const { type, id } = getApiId(shortId);
  const url = `https://www.openstreetmap.org/api/0.6/${type}/${id}`; // TODO full to fetch ways  // todo fetch on backend ??
  return fetchXml(url);
};

export const getFeatureFromApi = async osmShortId => {
  const osmXml = await fetchElement(osmShortId);

  const item = osmXml.getElementsByTagName('osm')[0].children[0];
  const tags = item.getElementsByTagName('tag');
  const properties = {};
  for (let i = 0; i < tags.length; i++) {
    const x = tags[i];
    properties[x.getAttribute('k')] = x.getAttribute('v');
  }

  const feature = {
    geometry: {
      coordinates: [item.getAttribute('lon'), item.getAttribute('lat')],
    },
    properties,
  };

  console.log('fetched', feature); // eslint-disable-line no-console
  return feature;
};
