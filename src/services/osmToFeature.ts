import { Feature } from './types';
import { getPoiClass } from './getPoiClass';

export const osmToFeature = (element): Feature => {
  const {
    tags = {},
    lat,
    lon,
    nodes,
    members,
    osmappDeletedMarker,
    ...osmMeta
  } = element;
  return {
    type: 'Feature' as const,
    geometry: undefined,
    center: lat ? [lon, lat] : undefined,
    osmMeta,
    tags,
    members,
    properties: { ...getPoiClass(tags) },
    deleted: osmappDeletedMarker,
  };
};
