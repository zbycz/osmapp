import { Feature, LonLatRounded } from './types';

export const getCoordsFeature = ([lon, lat]: LonLatRounded): Feature => ({
  type: 'Feature',
  point: true,
  roundedCenter: [lon, lat],
  center: [lon, lat].map(parseFloat),
  osmMeta: {
    type: `${Math.random()}`, // used as react key for EditDialog, ObjectsAround etc. (id must be empty)
    id: '',
  },
  tags: {},
  properties: { class: 'marker', subclass: 'point' },
});
