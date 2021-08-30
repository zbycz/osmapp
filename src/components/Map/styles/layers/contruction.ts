export const motorwayConstruction = {
  id: 'highway-motorway-construction',
  type: 'line',
  source: 'maptiler_planet',
  'source-layer': 'transportation',
  minzoom: 5,
  filter: [
    'all',
    ['==', '$type', 'LineString'],
    [
      'all',
      // ['!in', 'brunnel', 'bridge', 'tunnel'],
      ['==', 'class', 'motorway_construction'],
    ],
  ],
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
    visibility: 'visible',
  },
  paint: {
    'line-color': '#fff',
    'line-width': {
      base: 1.2,
      stops: [
        [6.5, 0],
        [7, 0.5],
        [20, 18],
      ],
    },
    'line-opacity': {
      stops: [
        [5, 0],
        [14, 0.4],
      ],
    },
  },
};
