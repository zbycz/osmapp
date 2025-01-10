import {
  Feature,
  LineString,
  Point,
  FeatureGeometry,
  isPoint,
  isLineString,
  Position,
} from '../types';

import { getPoiClass } from '../getPoiClass';
import { getBbox } from '../getCenter';

export const getCenter = (geometry: FeatureGeometry): Position => {
  if (isPoint(geometry)) {
    return geometry.coordinates;
  }

  if (isLineString(geometry) && geometry.coordinates?.length) {
    const { w, s, e, n } = getBbox(geometry.coordinates); // [WSEN]
    const lon = (w + e) / 2; // flat earth rulezz
    const lat = (s + n) / 2;
    return [lon, lat];
  }

  // relation
  return undefined;
};

const notNull = (x) => x != null;

const getGeometry = {
  node: ({ lat, lon }): Point => ({ type: 'Point', coordinates: [lon, lat] }),
  way: (foo): LineString => {
    const { geometry } = foo;
    return {
      type: 'LineString',
      coordinates: geometry?.filter(notNull)?.map(({ lat, lon }) => [lon, lat]),
    };
  },
  relation: ({ members }): LineString => ({
    type: 'LineString',
    coordinates: members[0]?.geometry
      ?.filter(notNull)
      ?.map(({ lat, lon }) => [lon, lat]),
  }),
};

export const overpassAroundToSkeletons = (response: any): Feature[] =>
  response.elements.map((element) => {
    const { type, id, tags = {} } = element;
    const geometry = getGeometry[type]?.(element);
    return {
      type: 'Feature',
      osmMeta: { type, id },
      tags,
      properties: getPoiClass(tags),
      geometry,
      center: getCenter(geometry) ?? undefined,
    };
  });
