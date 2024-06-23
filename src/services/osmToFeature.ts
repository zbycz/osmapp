import { Feature } from './types';
import { getPoiClass } from './getPoiClass';
import { getImageTags } from './images/getImageTags';
import { getShortId } from './helpers';

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
    imageTags: getImageTags(tags, getShortId(osmMeta)),
    properties: { ...getPoiClass(tags) },
    deleted: osmappDeletedMarker,
  };
};
