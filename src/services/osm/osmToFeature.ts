import { Feature } from '../types';
import { getPoiClass } from '../getPoiClass';
import { getImageDefs } from '../images/getImageDefs';

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
  const center = lat ? [lon, lat] : undefined;
  return {
    type: 'Feature' as const,
    geometry: undefined,
    center,
    osmMeta,
    tags,
    members,
    imageDefs: getImageDefs(tags, osmMeta.type, center),
    properties: { ...getPoiClass(tags) }, // TODO PoiClass is computed from tags, this can be removed
    deleted: osmappDeletedMarker,
  };
};
