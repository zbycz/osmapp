import * as xml2js from 'isomorphic-xml2js';

export const parseXmlString = (xmlString) => {
  const parser = new xml2js.Parser({
    explicitArray: false,
    explicitCharkey: false,
    explicitRoot: false,
  });

  return new Promise<any>((resolve, reject) => {
    parser.parseString(xmlString, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export interface OsmApiId {
  type: string;
  id: string;
}

// apiId.replace(/([a-z])[a-z]+\/([0-9]+)/, '$1$2');
export const getShortId = (apiId: OsmApiId): string =>
  `${apiId.type[0]}${apiId.id}`;

export const getUrlOsmId = (apiId: OsmApiId): string =>
  `${apiId.type}/${apiId.id}`;

export const getApiId = (value): OsmApiId => {
  if (value.type && value.id) {
    return value;
  }

  const shortId = value;
  const type = { w: 'way', n: 'node', r: 'relation' }[shortId[0]];
  const id = shortId.substr(1);
  return { type, id };
};

export const getShortLink = (apiId: OsmApiId) =>
  `https://osmapp.org/${apiId.type}/${apiId.id}`;

export const prod = process.env.NODE_ENV === 'production';
