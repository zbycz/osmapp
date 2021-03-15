
import * as xml2js from 'isomorphic-xml2js';
import geojsonExtent from '@mapbox/geojson-extent';

export const parseXmlString = (xmlString) => {
  const parser = new xml2js.Parser({
    explicitArray: false,
    explicitCharkey: false,
    explicitRoot: false,
  });

  return new Promise((resolve, reject) => {
    parser.parseString(xmlString, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// apiId.replace(/([a-z])[a-z]+\/([0-9]+)/, '$1$2');
export const getShortId = (apiId) => apiId.type[0] + apiId.id;

export const getApiId = (value) => {
  if (value.type && value.id) {
    return value;
  }

  const shortId = value;
  const type = { w: 'way', n: 'node', r: 'relation' }[shortId[0]];
  const id = shortId.substr(1);
  return { type, id };
};

export const getShortLink = (apiId) => `https://osmapp.org/${apiId.type}/${apiId.id}`;

export const getCenter = (feature) => {
  const { type } = feature.geometry;

  // node
  if (!type || type === 'Point') {
    return feature.geometry.coordinates;
  }

  // relation
  if (type !== 'LineString' && type !== 'Polygon') {
    console.warn('Error: Unknown geometry', type, feature);
    return undefined;
  }

  // way
  try {
    const ex = geojsonExtent(feature); // [WSEN]
    const avg = (a, b) => (a + b) / 2; // flat earth rulezz
    const lon = avg(ex[0], ex[2]);
    const lat = avg(ex[1], ex[3]);
    return [lon, lat];
  } catch (e) {
    console.warn('Error: Unknown center of geojson', e, feature);
    return undefined;
  }
};

export const prod = process.env.NODE_ENV === 'production';
