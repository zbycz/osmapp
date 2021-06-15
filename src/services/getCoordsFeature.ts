import { Feature, LonLatRounded } from './types';

export const getCoordsFeature = ([lon, lat]: LonLatRounded): Feature => ({
  type: 'Feature',
  point: true,
  roundedCenter: [lon, lat],
  center: [lon, lat].map(parseFloat),
  osmMeta: {
    type: `${Math.random()}`, // used as react key for EditDialog
    id: 'n/a',
  },
  tags: { name: `${lat}° ${lon}°` },
  properties: { class: 'marker', subclass: 'point' },
});
