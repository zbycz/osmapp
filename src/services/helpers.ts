import * as xml2js from 'isomorphic-xml2js';
import fetch from 'isomorphic-unfetch';
import { isServer, isString } from '../components/helpers';
import { Feature } from './types';
import { join, roundedToDegUrl } from '../utils';

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

export const buildXmlString = (xml) => {
  const builder = new xml2js.Builder({ rootName: 'osm' });
  return builder.buildObject(xml);
};

export interface OsmApiId {
  // type: 'node' | 'way' | 'relation';
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

export const getOsmappLink = (feature: Feature) => {
  if (!feature.point && feature?.osmMeta?.id)
    return `/${getUrlOsmId(feature.osmMeta)}`;

  if (feature?.roundedCenter)
    return `/${roundedToDegUrl(feature.roundedCenter)}`;

  return '';
};

export const getFullOsmappLink = (feature: Feature) =>
  `https://osmapp.org${getOsmappLink(feature)}`;

export const isSameOsmId = (feature, skeleton) =>
  feature && skeleton && getOsmappLink(feature) === getOsmappLink(skeleton);

export const prod = process.env.NODE_ENV === 'production';

export const isValidImage = (url): Promise<boolean> => {
  if (isServer()) {
    return fetch(url).then(
      ({ headers }) => !!headers.get('content-type')?.match(/^image\//),
      () => false,
    );
  }

  return new Promise((resolve) => {
    const imgElement = new Image();
    imgElement.onload = () => resolve(true);
    imgElement.onerror = () => resolve(false);
    imgElement.src = url;
  });
};

export const stringifyDomXml = (itemXml) =>
  isString(itemXml) ? itemXml : new XMLSerializer().serializeToString(itemXml);

export const buildAddress = ({
  'addr:place': place,
  'addr:street': street,
  'addr:housenumber': hnum,
  'addr:conscriptionnumber': num1, // czech/slovak/hungary
  'addr:streetnumber': num2,
  'addr:city': city,
}) =>
  join(join(street ?? place, ' ', hnum ?? join(num1, '/', num2)), ', ', city);
