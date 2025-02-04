import { getImagesFromCenter } from './images/getImageDefs';
import { Feature, FeatureTags, LonLat, LonLatRounded, OsmType } from './types';

let nextId = 0;
export const getNewId = () => {
  nextId -= 1; // negative id means "adding new point" in osmApiAuth#saveChanges()
  return nextId;
};

export const getCoordsFeature = ([lon, lat]: LonLatRounded): Feature => {
  const center = [lon, lat].map(parseFloat);
  return {
    type: 'Feature',
    point: true,
    roundedCenter: [lon, lat],
    center,
    osmMeta: {
      type: 'node',
      id: getNewId(), // this is called twice: 1. onMapClicked 2. getInitialFeature
    },
    tags: {},
    properties: { class: 'marker', subclass: 'point' },
    imageDefs: getImagesFromCenter({}, center),
  };
};

export const getNewNode = (
  [lon, lat]: LonLat,
  name: string,
  defaultTags: FeatureTags = {},
): Feature => {
  return {
    type: 'Feature',
    point: true,
    center: [lon, lat],
    osmMeta: {
      type: 'node',
      id: getNewId(),
    },
    tags: { name, ...defaultTags },
    properties: { class: 'marker', subclass: 'point' },
  };
};
