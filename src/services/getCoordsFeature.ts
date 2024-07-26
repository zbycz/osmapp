import { Feature, LonLatRounded } from './types';

export const getCoordsFeature = ([lon, lat]: LonLatRounded): Feature => {
  const center = [lon, lat].map(parseFloat);
  return {
    type: 'Feature',
    point: true,
    roundedCenter: [lon, lat],
    center,
    osmMeta: {
      type: `coordsFeature-${Math.random()}`, // used as react key for EditDialog, ObjectsAround etc. (id must be empty)
      id: '',
    },
    tags: {},
    properties: { class: 'marker', subclass: 'point' },
    imageDefs: [{ type: 'center', service: 'mapillary', center }],
  };
};
