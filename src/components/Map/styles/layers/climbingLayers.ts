import type {
  ExpressionSpecification,
  LayerSpecification,
} from '@maplibre/maplibre-gl-style-spec';

const linear = (
  from: number,
  num1: number,
  to: number,
  num2: number,
): ExpressionSpecification => [
  'interpolate',
  ['linear'],
  ['zoom'],
  from,
  num1,
  to,
  num2,
];

const linearFadeOut = (from: number, to: number): ExpressionSpecification =>
  linear(from, 1, to, 0.3);

const routes: LayerSpecification[] = [
  {
    id: 'climbing-3-routes-circle',
    type: 'circle',
    source: 'climbing',
    minzoom: 16,
    filter: [
      'all',
      ['==', 'osmappType', 'node'],
      ['==', 'climbing', 'route_bottom'],
    ],
    paint: {
      'circle-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#4150a0',
        '#ea5540',
      ],
      'circle-radius': linear(16, 1, 21, 6),
      'circle-opacity': linear(16, 0.4, 21, 1),
    },
  } as LayerSpecification,
  {
    id: 'climbing-3-routes-labels',
    type: 'symbol',
    source: 'climbing',
    minzoom: 19,
    filter: [
      'all',
      ['==', 'osmappType', 'node'],
      ['==', 'climbing', 'route_bottom'],
    ],
    layout: {
      'text-padding': 2,
      'text-font': ['Noto Sans Medium'],
      'text-anchor': 'left',
      'text-field': '{name} {climbing:grade:uiaa}',
      'text-offset': [1, 0],
      'text-size': linear(20, 12, 26, 30),
      'text-max-width': 9,
      'text-allow-overlap': false,
      'text-optional': true,
    },
    paint: {
      'text-halo-blur': 0.5,
      'text-color': '#666',
      'text-halo-width': 1,
      'text-halo-color': '#ffffff',
    },
  },
];

const crags: LayerSpecification = {
  id: 'climbing-2-crags',
  type: 'symbol',
  source: 'climbing',
  minzoom: 15,
  maxzoom: 20,
  filter: [
    'all',
    ['==', 'osmappType', 'relationPoint'],
    ['==', 'climbing', 'crag'],
  ],
  layout: {
    'text-padding': 2,
    'text-font': ['Noto Sans Bold'],
    'text-anchor': 'top',
    'icon-image': 'circle_11',
    'text-field': '{name}',
    'text-offset': [
      'step',
      ['zoom'],
      ['literal', [0, 0.6]],
      18.5,
      ['literal', [0, 0.8]],
    ],
    'text-size': linear(15, 12, 21, 18),
    'text-max-width': 9,
    'icon-optional': false,
    'icon-ignore-placement': false,
    'icon-allow-overlap': false,
    'text-ignore-placement': false,
    'text-allow-overlap': false,
    'text-optional': true,
    'icon-size': linear(15, 1, 21, 2),
    'symbol-sort-key': ['*', -1, ['to-number', ['get', 'osmappRouteCount']]],
  },
  paint: {
    'text-halo-blur': 0.5,
    'text-color': '#ea5540',
    'text-halo-width': 2,
    'text-halo-color': '#ffffff',
  },
};
const areas: LayerSpecification = {
  id: 'climbing-1-areas',
  type: 'symbol',
  source: 'climbing',
  minzoom: 5,
  maxzoom: 16,
  filter: [
    'all',
    ['==', 'osmappType', 'relationPoint'],
    ['==', 'climbing', 'area'],
  ],
  layout: {
    'text-padding': 2,
    'text-font': ['Noto Sans Bold'],
    'text-anchor': 'top',
    'icon-image': 'square_11',
    'text-field': '{name}',
    'text-offset': [0, 0.6],
    'text-size': ['interpolate', ['linear'], ['zoom'], 11.5, 14],
    // 'icon-size': 1.5,
    'text-max-width': 9,
    'icon-optional': false,
    'icon-ignore-placement': false,
    'icon-allow-overlap': false,
    'text-ignore-placement': false,
    'text-allow-overlap': false,
    'text-optional': true,
    'symbol-sort-key': ['*', -1, ['to-number', ['get', 'osmappRouteCount']]],
  },
  paint: {
    'icon-opacity': linearFadeOut(14, 16),
    'text-opacity': linearFadeOut(14, 16),
    'text-color': 'rgba(0, 95, 204, 1)',
    'text-halo-color': 'rgba(250, 250, 250, 1)',
    'text-halo-width': 2,
  },
};

export const climbingLayers: LayerSpecification[] = [...routes, crags, areas];
