import fetch from 'isomorphic-unfetch';
import { isServer } from '../components/helpers';
import { Feature, OsmId, OsmType, Position } from './types';
import { join, roundedToDegUrl } from '../utils';
import { PROJECT_URL } from './project';
import { getIdFromShortener, getShortenerSlug } from './shortener';

export const getShortId = ({ id, type }: OsmId): string => `${type[0]}${id}`;
export const getUrlOsmId = ({ id, type }: OsmId): string => `${type}/${id}`;

export const getReactKey = (feature: Feature) =>
  getUrlOsmId(feature.osmMeta) +
  '_' +
  (feature.point ? feature.center.join(',') : feature.osmMeta.version);

export const getApiId = (shortId: string): OsmId => {
  const type = { w: 'way', n: 'node', r: 'relation' }[shortId[0]] as OsmType;
  const id = parseInt(shortId.substring(1), 10);
  return { type, id };
};

export const getOsmappLink = (feature: Feature | null) => {
  if (!feature.point && feature?.osmMeta?.id)
    return `/${getUrlOsmId(feature.osmMeta)}`;

  if (feature?.roundedCenter)
    return `/${roundedToDegUrl(feature.roundedCenter)}`;

  return '/';
};

export const getFullOsmappLink = (feature: Feature) =>
  `${PROJECT_URL}${getOsmappLink(feature)}`;

export const getShortLink = (feature: Feature) => {
  const slug = getShortenerSlug(feature.osmMeta);
  return slug === null ? null : `${PROJECT_URL}/${slug}`;
};

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

export type ImageSize = { width: number; height: number } | null;

export const getImageSize = (url): Promise<ImageSize> =>
  new Promise((resolve) => {
    const imgElement = new Image();
    imgElement.onload = () =>
      resolve({ width: imgElement.width, height: imgElement.height });
    imgElement.onerror = () => resolve(null);
    imgElement.src = url;
  });

// TODO better mexico border + add Australia, New Zealand & South Africa
const polygonUsCan = [[-143, 36], [-117, 32], [-96, 25], [-50, 19], [-56, 71], [-175, 70], [-143, 36]]; // prettier-ignore
const isInside = ([x, y]: Position, points) => {
  // ray-casting algorithm based on https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};
const isNumberFirst = (loc: Position) => loc && isInside(loc, polygonUsCan);

export const buildAddress = (
  {
    'addr:place': place,
    'addr:street': street,
    'addr:housenumber': hnum,
    'addr:conscriptionnumber': cnum, // czech/slovak/hungary
    'addr:streetnumber': snum,
    'addr:city': city,
    'addr:state': state,
    'addr:postcode': postcode,
  }: Record<string, string>,
  position?: Position,
) => {
  const number = hnum ?? join(cnum, '/', snum);
  const streetPlace = street ?? place;

  return join(
    isNumberFirst(position)
      ? join(number, ' ', streetPlace)
      : join(streetPlace, ' ', number),
    ', ',
    join(join(postcode, ' ', city), ', ', state),
  );
};

export const doShortenerRedirect = (ctx) => {
  const {
    query: { all },
  } = ctx;

  if (all?.length === 1) {
    const apiId = getIdFromShortener(all[0]);

    if (apiId !== null) {
      const location = `/${getUrlOsmId(apiId)}`;

      ctx.res.writeHead(301, { location }).end();
      return true;
    }
  }

  return false;
};

export class FetchError extends Error {
  constructor(
    public message: string = '',
    public code: string,
    public data: string = '',
  ) {
    super();
  }

  toString() {
    const suffix = this.data && ` Data: ${this.data.substring(0, 1000)}`;
    return `Fetch: ${this.message}${suffix}`;
  }
}
