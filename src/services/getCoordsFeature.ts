import { Feature, LonLatRounded } from './types';

export const getCoordsFeature = ([lon, lat]: LonLatRounded): Feature => ({
    type: 'Feature',
    point: true,
    roundedCenter: [lon, lat],
    center: [lon, lat].map(parseFloat),
    osmMeta: { type: `${Math.random()}`, id: 'n/a' }, // used as react key for EditDialog
    tags: { name: `${lat}° ${lon}°` },
    properties: { class: 'marker', subclass: 'point' },
  });
