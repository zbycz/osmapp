import {
  ExpressionSpecification,
  LayerSpecification,
  SymbolLayerSpecification,
} from '@maplibre/maplibre-gl-style-spec';
import type { DataDrivenPropertyValueSpecification } from 'maplibre-gl';
import { AREA, CRAG } from '../MapFooter/ClimbingLegend';

export const CLIMBING_TILES_SOURCE = 'climbing-tiles';

export const CLIMBING_SPRITE = {
  id: 'climbing',
  url: `${window.location.protocol}//${window.location.host}/icons-climbing/sprites/climbing`,
};

const linear = (
  from: number,
  a: number | ExpressionSpecification,
  mid: number,
  b: number | ExpressionSpecification,
  to?: number,
  c?: number | ExpressionSpecification,
): ExpressionSpecification => [
  'interpolate',
  ['linear'],
  ['zoom'],
  from,
  a,
  mid,
  b,
  ...(to && c ? [to, c] : []),
];

const linearByRouteCount = (
  from: number,
  a: number | ExpressionSpecification,
  to: number,
  b: number | ExpressionSpecification,
): ExpressionSpecification => [
  'interpolate',
  ['linear'],
  ['coalesce', ['get', 'osmappRouteCount'], 0],
  from,
  a,
  to,
  b,
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

const ifCrag = (
  value: ExpressionSpecification | number,
  elseValue: ExpressionSpecification | number,
): ExpressionSpecification => [
  'case',
  ['==', ['get', 'climbing'], 'crag'],
  value,
  elseValue,
];

const sortKey = [
  '*',
  -1,
  [
    '+',
    ['to-number', ['get', 'osmappRouteCount']],
    ['case', ['get', 'osmappHasImages'], 10000, 0], // preference for items with images
    ['case', ['to-boolean', ['get', 'name']], 2, 0], // prefer items with name
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

export const routes: LayerSpecification[] = [
  {
    id: 'climbing route (line)',
    metadata: { clickableWithOsmId: true },
    type: 'line',
    source: CLIMBING_TILES_SOURCE,
    minzoom: 16,
    filter: ['all', ['==', 'type', 'route']],
    paint: {
      'line-width': 2,
    },
  },
  {
    id: 'climbing route (circle)',
    metadata: { clickableWithOsmId: true },
    type: 'circle',
    source: CLIMBING_TILES_SOURCE,
    minzoom: 16,
    filter: ['all', ['==', 'type', 'route']],
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
    id: 'climbing route (label)',
    metadata: { clickableWithOsmId: true },
    type: 'symbol',
    source: CLIMBING_TILES_SOURCE,
    minzoom: 19,
    filter: ['all', ['==', 'type', 'route']],
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
  'icon-allow-overlap': ['step', ['zoom'], true, 4, false],
  'text-field': ['step', ['zoom'], '', 4, ['get', 'osmappLabel']],
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

const areaSize = linearByRouteCount(0, 0.4, 400, 1);
const cragSize = linearByRouteCount(0, 0.4, 50, 0.7);
const cragSizeBig = 1;

const mixed: LayerSpecification = {
  id: 'climbing group',
  metadata: { clickableWithOsmId: true },
  type: 'symbol',
  source: CLIMBING_TILES_SOURCE,
  maxzoom: 20,
  filter: ['all', ['==', 'type', 'group']],
  layout: {
    'icon-image': ifCrag(
      byHasImages(CRAG, 'IMAGE'),
      byHasImages(AREA, 'IMAGE'),
    ),
    'icon-size': linear(
      6,
      0.4,
      8,
      ifCrag(cragSize, areaSize),
      21,
      ifCrag(cragSizeBig, areaSize),
    ),
    'text-size': linear(
      5,
      ifCrag(12, 12),
      15,
      ifCrag(12, 14),
      21,
      ifCrag(20, 14),
    ),
    'text-offset': [0, 0.6],
    ...COMMON_LAYOUT,
  },
  paint: {
    'icon-opacity': hover(1, 0.6),
    'text-opacity': hover(1, 0.6),
    'text-color': ifCrag(
      byHasImages(CRAG, 'COLOR'),
      byHasImages(AREA, 'COLOR'),
    ),
    ...COMMON_PAINT,
  },
};

export const climbingLayers: LayerSpecification[] = [...routes, mixed];
