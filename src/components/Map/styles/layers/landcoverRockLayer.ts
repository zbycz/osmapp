export const landcoverRockLayer = {
  id: 'landcover_rock',
  type: 'fill',
  paint: {
    'fill-color': 'rgba(235, 235, 235, 1)',
    'fill-opacity': 1,
    'fill-antialias': false,
  },
  filter: ['all', ['==', 'class', 'rock']],
  layout: { visibility: 'visible' },
  source: 'maptiler_planet',
  maxzoom: 24,
  minzoom: 9,
  metadata: {},
  'source-layer': 'landcover',
};
