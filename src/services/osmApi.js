/* eslint no-undef:1 */
// @flow

import 'isomorphic-unfetch';

export function getApiId(shortId) {
  const type = { w: 'way', n: 'node', r: 'relation' }[shortId[0]];
  const id = shortId.substr(1);
  return { type, id };
}

export function getShortId(apiId) {
  if (typeof apiId === 'string') {
    return apiId.replace(/([a-z])[a-z]+\/([0-9]+)/, '$1$2');
  }
  return apiId.type[0] + apiId.id;
}

export function fetchOsmXmlAsGeojson(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      // this.setState({ isLoading: false });
      return response;
    })
    .then(response => response.text())
    .then(xmlStr => new window.DOMParser().parseFromString(xmlStr, 'text/xml'));
}

export function fetchElement(shortId) {
  const { type, id } = getApiId(shortId);
  const url = `https://www.openstreetmap.org/api/0.6/${type}/${id}`;
  return fetchOsmXmlAsGeojson(url);
}
