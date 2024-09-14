import {
  ExpressionSpecification,
  LayerSpecification,
  SymbolLayerSpecification,
} from '@maplibre/maplibre-gl-style-spec';
import type { DataDrivenPropertyValueSpecification } from 'maplibre-gl';
import { AREA, CRAG } from '../../MapFooter/ClimbingLegend';

export const CLIMBING_SPRITE = {
  id: 'climbing',
  url: `${window.location.protocol}//${window.location.host}/icons-climbing/sprites/climbing`,
};

const linear = (
  from: number,
  a: number | ExpressionSpecification,
  to: number,
  b: number | ExpressionSpecification,
): ExpressionSpecification => [
  'interpolate',
  ['linear'],
  ['zoom'],
  from,
  a,
  to,
  b,
];

const linearByRouteCount = (
  from: number,
  num1: number,
  to: number,
  num2: number,
): ExpressionSpecification => [
  'interpolate',
  ['linear'],
  ['get', 'osmappRouteCount'],
  from,
  num1,
  to,
  num2,
];

const ifHasImages = (
  value: string,
  elseValue: string,
): ExpressionSpecification => [
  'case',
  ['get', 'osmappHasImages'],
  value,
  elseValue,
];

const byHasImages = (
  spec: typeof AREA | typeof CRAG,
  property: 'IMAGE' | 'COLOR',
): ExpressionSpecification =>
  ifHasImages(spec.HAS_IMAGES[property], spec.NO_IMAGES[property]);

const sortKey = [
  '*',
  -1,
  [
    '+',
    ['get', 'osmappRouteCount'],
    ['case', ['get', 'osmappHasImages'], 99999, 0], // preference for items with images
  ],
] as DataDrivenPropertyValueSpecification<number>;

const hover = (basic: number, hovered: number): ExpressionSpecification => [
  'case',
  ['boolean', ['feature-state', 'hover'], false],
  hovered,
  basic,
];
const step = (
  a: unknown,
  from: number,
  b: unknown,
): ExpressionSpecification => [
  'step',
  ['zoom'],
  ['literal', a],
  from,
  ['literal', b],
];

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

const COMMON_LAYOUT: SymbolLayerSpecification['layout'] = {
  'icon-optional': false,
  'icon-ignore-placement': false,
  'icon-allow-overlap': false,
  'text-field': '{osmappLabel}',
  'text-padding': 2,
  'text-font': ['Noto Sans Bold'],
  'text-anchor': 'top',
  'text-max-width': 9,
  'text-ignore-placement': false,
  'text-allow-overlap': false,
  'text-optional': true,
  'symbol-sort-key': sortKey,
};

const COMMON_PAINT: SymbolLayerSpecification['paint'] = {
  'text-halo-color': '#ffffff',
  'text-halo-width': 2,
};

const crags: LayerSpecification = {
  id: 'climbing-2-crags',
  type: 'symbol',
  source: 'climbing',
  minzoom: 10,
  maxzoom: 20,
  filter: [
    'all',
    ['==', 'osmappType', 'relationPoint'],
    ['==', 'climbing', 'crag'],
  ],
  layout: {
    'icon-image': byHasImages(CRAG, 'IMAGE'),
    'icon-size': linearByRouteCount(0, 0.5, 50, 1),
    'text-size': linear(15, 12, 21, 18),
    'text-offset': step([0, 0.6], 18.5, [0, 0.8]),
    ...COMMON_LAYOUT,
  },
  paint: {
    'icon-opacity': hover(1, 0.6),
    'text-opacity': hover(1, 0.6),
    'text-color': byHasImages(CRAG, 'COLOR'),
    ...COMMON_PAINT,
  },
};

const areas: LayerSpecification = {
  id: 'climbing-1-areas',
  type: 'symbol',
  source: 'climbing',
  maxzoom: 18,
  filter: [
    'all',
    ['==', 'osmappType', 'relationPoint'],
    ['==', 'climbing', 'area'],
  ],
  layout: {
    'icon-image': byHasImages(AREA, 'IMAGE'),
    'icon-size': linearByRouteCount(0, 0.4, 400, 1),
    'text-size': 14,
    'text-offset': [0, 0.6],
    ...COMMON_LAYOUT,
  },
  paint: {
    'icon-opacity': linear(17, hover(1, 0.6), 18, hover(0.3, 0.1)),
    'text-opacity': linear(17, hover(1, 0.6), 18, hover(0.3, 0.1)),
    'text-color': byHasImages(AREA, 'COLOR'),
    ...COMMON_PAINT,
  },
};

export const climbingLayers: LayerSpecification[] = [...routes, crags, areas];
