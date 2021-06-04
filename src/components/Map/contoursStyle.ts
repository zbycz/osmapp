// https://github.com/openmaptiles/klokantech-terrain-gl-style/blob/master/style.json

export const contoursStyle = [
  {
    id: 'hillshading',
    type: 'raster',
    source: 'hillshading',
    layout: { visibility: 'visible' },
    paint: {
      'raster-contrast': 0,
      'raster-fade-duration': 300,
      'raster-opacity': {
        base: 0.5,
        stops: [
          [3, 0],
          [5, 0.15],
          [12, 0.15],
        ],
      },
    },
  },
  {
    id: 'contour_label',
    type: 'symbol',
    metadata: {},
    source: 'contours',
    'source-layer': 'contour',
    filter: [
      'all',
      ['==', '$type', 'LineString'],
      ['in', 'nth_line', 10, 5],
      ['>', 'height', 0],
    ],
    layout: {
      'symbol-avoid-edges': true,
      'symbol-placement': 'line',
      'text-allow-overlap': false,
      'text-field': '{height} m',
      'text-font': ['Noto Sans Regular'],
      'text-ignore-placement': false,
      'text-padding': 10,
      'text-rotation-alignment': 'map',
      'text-size': {
        base: 1,
        stops: [
          [15, 9.5],
          [20, 12],
        ],
      },
    },
    paint: {
      'text-color': 'hsl(0, 0%, 37%)',
      'text-halo-color': 'hsla(0, 0%, 100%, 0.5)',
      'text-halo-width': 1.5,
    },
  },
  {
    id: 'contour_index',
    type: 'line',
    source: 'contours',
    'source-layer': 'contour',
    filter: ['all', ['>', 'height', 0], ['in', 'nth_line', 10, 5]],
    layout: { visibility: 'visible' },
    paint: {
      'line-color': 'hsl(0, 1%, 58%)',
      'line-opacity': 0.4,
      'line-width': 1.1,
    },
  },
  {
    id: 'contour',
    type: 'line',
    source: 'contours',
    'source-layer': 'contour',
    filter: ['all', ['!in', 'nth_line', 10, 5], ['>', 'height', 0]],
    layout: { visibility: 'visible' },
    paint: {
      'line-color': 'hsl(0, 1%, 58%)',
      'line-opacity': 0.3,
      'line-width': 0.6,
    },
  },
];
