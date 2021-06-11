export const buildings3dBase = [
  {
    id: 'building',
    type: 'fill',
    metadata: {
      'mapbox:group': '1444849364238.8171',
    },
    source: 'maptiler_planet',
    'source-layer': 'building',
    paint: {
      'fill-color': {
        base: 1,
        stops: [
          [15.5, '#f2eae2'],
          [16, '#dfdbd7'],
        ],
      },
      'fill-antialias': true,
    },
  },
  {
    id: 'building-top',
    type: 'fill',
    metadata: {
      'mapbox:group': '1444849364238.8171',
    },
    source: 'maptiler_planet',
    'source-layer': 'building',
    layout: {
      visibility: 'visible',
    },
    paint: {
      'fill-translate': {
        base: 1,
        stops: [
          [14, [0, 0]],
          [16, [-2, -2]],
        ],
      },
      'fill-outline-color': '#dfdbd7',
      'fill-color': '#f2eae2',
      'fill-opacity': {
        base: 1,
        stops: [
          [13, 0],
          [16, 1],
        ],
      },
    },
  },
];

export const buildings3dExtrusion = [
  {
    id: 'building-3d',
    type: 'fill-extrusion',
    metadata: {},
    source: 'maptiler_planet',
    'source-layer': 'building',
    minzoom: 14,
    filter: ['all', ['!has', 'hide_3d']],
    layout: { visibility: 'visible' },
    paint: {
      'fill-extrusion-base': {
        property: 'render_min_height',
        type: 'identity',
      },
      'fill-extrusion-color': 'rgba(189, 185, 181, 1)',
      'fill-extrusion-height': {
        property: 'render_height',
        type: 'identity',
      },
      'fill-extrusion-opacity': 0.3,

      // 'fill-extrusion-base': {
      //   property: 'render_min_height',
      //   type: 'identity',
      // },
      // 'fill-extrusion-color': [
      //   'case',
      //   ['has', 'colour'],
      //   ['get', 'colour'],
      //   'hsl(39, 41%, 86%)',
      // ],
      // 'fill-extrusion-height': {
      //   property: 'render_height',
      //   type: 'identity',
      // },
      // 'fill-extrusion-opacity': 0.3,
    },
  },
];
