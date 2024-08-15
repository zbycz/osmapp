import type {
  ExpressionSpecification,
  LayerSpecification,
} from '@maplibre/maplibre-gl-style-spec';
import type { DataDrivenPropertyValueSpecification } from 'maplibre-gl';
import { CLIMBING_LEGEND } from '../../MapFooter/ClimbingLegend';

export const CLIMBING_SPRITE = {
  id: 'climbing',
  url: `${window.location.protocol}//${window.location.host}/icons-climbing/sprites/climbing`,
};

export const CRAG_VISIBLE_FROM_ZOOM = 9;

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

const linearFadeOut = (from: number, to: number): ExpressionSpecification =>
  linear(from, 1, to, 0.3);

export const routes: LayerSpecification[] = [
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

const ifHasImages = <T>(value: T, elseValue: T) =>
  [
    'case',
    ['get', 'osmappHasImages'],
    value,
    elseValue,
  ] as ExpressionSpecification;

const sortKey = [
  '*',
  -1,
  [
    '+',
    ['get', 'osmappRouteCount'],
    ['case', ['get', 'osmappHasImages'], 99999, 0], // preference for items with images
  ],
] as DataDrivenPropertyValueSpecification<number>;

const crags: LayerSpecification = {
  id: 'climbing-2-crags',
  type: 'symbol',
  source: 'climbing',
  minzoom: CRAG_VISIBLE_FROM_ZOOM,
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

    'icon-image': ifHasImages(
      CLIMBING_LEGEND.CRAG.HAS_IMAGES.DEFAULT.IMAGE,
      CLIMBING_LEGEND.CRAG.NO_IMAGES.DEFAULT.IMAGE,
    ),

    'icon-optional': false,
    'icon-ignore-placement': false,
    'icon-allow-overlap': true,
    'text-field': '{osmappLabel}',
    'text-offset': [
      'step',
      ['zoom'],
      ['literal', [0, 0.6]],
      18.5,
      ['literal', [0, 0.8]],
    ],
    'text-size': linear(15, 12, 21, 18),
    'text-max-width': 9,
    'text-ignore-placement': false,
    'text-allow-overlap': false,
    'text-optional': true,
    'icon-size': linearByRouteCount(0, 0.5, 50, 1),
    'symbol-sort-key': sortKey,
  },
  paint: {
    'icon-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.6,
      1,
    ],
    'text-halo-blur': 0.5,
    'text-halo-width': 1.5,
    'text-halo-color': '#ffffff',
    'text-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      ifHasImages(
        CLIMBING_LEGEND.CRAG.HAS_IMAGES.HOVER.COLOR,
        CLIMBING_LEGEND.CRAG.NO_IMAGES.HOVER.COLOR,
      ),
      ifHasImages(
        CLIMBING_LEGEND.CRAG.HAS_IMAGES.DEFAULT.COLOR,
        CLIMBING_LEGEND.CRAG.NO_IMAGES.DEFAULT.COLOR,
      ),
    ],
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
    'text-padding': 2,
    'text-font': ['Noto Sans Bold'],
    'text-anchor': 'top',
    'text-field': '{osmappLabel}',
    'text-offset': [0, 0.6],
    'text-size': ['interpolate', ['linear'], ['zoom'], 11.5, 14],
    'text-max-width': 9,
    'icon-size': linearByRouteCount(0, 0.4, 400, 1),
    'icon-image': ifHasImages(
      CLIMBING_LEGEND.AREA.HAS_IMAGES.DEFAULT.IMAGE,
      CLIMBING_LEGEND.AREA.NO_IMAGES.DEFAULT.IMAGE,
    ),
    'icon-optional': false,
    'icon-ignore-placement': false,
    'icon-allow-overlap': false,
    'text-ignore-placement': false,
    'text-allow-overlap': false,
    'text-optional': true,
    'symbol-sort-key': sortKey,
  },
  paint: {
    'icon-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.6,
      1,
    ],
    'text-opacity': linearFadeOut(14, 18),
    'text-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      ifHasImages(
        CLIMBING_LEGEND.AREA.HAS_IMAGES.HOVER.COLOR,
        CLIMBING_LEGEND.AREA.NO_IMAGES.HOVER.COLOR,
      ),
      ifHasImages(
        CLIMBING_LEGEND.AREA.HAS_IMAGES.DEFAULT.COLOR,
        CLIMBING_LEGEND.AREA.NO_IMAGES.DEFAULT.COLOR,
      ),
    ],
    'text-halo-color': 'rgba(250, 250, 250, 1)',
    'text-halo-width': 2,
  },
};

export const climbingLayers: LayerSpecification[] = [...routes, crags, areas];
