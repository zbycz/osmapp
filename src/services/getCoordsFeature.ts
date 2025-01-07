import { getImagesFromCenter } from './images/getImageDefs';
import { Feature, LonLat, LonLatRounded, OsmType } from './types';

let nextId = 0;

export const getCoordsFeature = ([lon, lat]: LonLatRounded): Feature => {
  nextId += 1; // this is called twice: 1. onMapClicked 2. getInitialFeature

  const center = [lon, lat].map(parseFloat);
  return {
    type: 'Feature',
    point: true,
    roundedCenter: [lon, lat],
    center,
    osmMeta: {
      type: 'node',
      id: nextId * -1, // negative id means "adding new point" in osmApiAuth#saveChanges()
    },
    tags: {},
    properties: { class: 'marker', subclass: 'point' },
    imageDefs: getImagesFromCenter({}, center),
  };
};

export const getNewNode = ([lon, lat]: LonLat, name: string): Feature => {
  nextId += 1;

  return {
    type: 'Feature',
    point: true,
    center: [lon, lat],
    osmMeta: {
      type: 'node',
      id: nextId * -1, // negative id means "adding new point" in osmApiAuth#saveChanges()
    },
    tags: { name },
    properties: { class: 'marker', subclass: 'point' },
  };
};
