import { Feature, LonLatRounded } from './types';

export const getCoordsFeature = ([lon, lat]: LonLatRounded): Feature => ({
  type: 'Feature',
  point: true,
  roundedCenter: [lon, lat],
  center: [lon, lat].map(parseFloat),
  osmMeta: {
    type: 'x',
    id: `${Math.random()}`, // used as react key for EditDialog, ObjectsAround etc.
  },
  tags: { name: `${lat}° ${lon}°` },
  properties: { class: 'marker', subclass: 'point' },
});
