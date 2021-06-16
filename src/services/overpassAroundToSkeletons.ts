import { Feature, LineString, Point } from './types';
import { getPoiClass } from './getPoiClass';
import { getCenter } from './getCenter';

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
