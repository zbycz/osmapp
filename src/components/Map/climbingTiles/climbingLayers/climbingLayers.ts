import {
  ExpressionSpecification,
  LayerSpecification,
  SymbolLayerSpecification,
} from '@maplibre/maplibre-gl-style-spec';
import { AREA, CLIMBING_TILES_SOURCE, CRAG } from '../consts';
import { linear, linearByRouteCount, sortKey } from './helpers';
import { routes } from './routes';

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
  crag: ExpressionSpecification | number,
  elseValue: ExpressionSpecification | number,
): ExpressionSpecification => [
  'case',
  ['==', ['get', 'climbing'], 'crag'],
  crag,
  elseValue,
];

const areaSize = linearByRouteCount(0, 0.4, 400, 1);
const cragSize = linearByRouteCount(0, 0.4, 50, 0.7);
const cragSizeBig = 1;

const GROUPS_LAYOUT: SymbolLayerSpecification['layout'] = {
  'icon-image': ifCrag(byHasImages(CRAG, 'IMAGE'), byHasImages(AREA, 'IMAGE')),
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

const hover = (basic: number, hovered: number): ExpressionSpecification => [
  'case',
  ['boolean', ['feature-state', 'hover'], false],
  hovered,
  basic,
];

const GROUPS_PAINT: SymbolLayerSpecification['paint'] = {
  'icon-opacity': hover(1, 0.6),
  'text-opacity': hover(1, 0.6),
  'text-color': ifCrag(byHasImages(CRAG, 'COLOR'), byHasImages(AREA, 'COLOR')),
  'text-halo-color': '#ffffff',
  'text-halo-width': 2,
};

const groups: LayerSpecification = {
  id: 'climbing group',
  metadata: { clickableWithOsmId: true },
  type: 'symbol',
  source: CLIMBING_TILES_SOURCE,
  maxzoom: 20,
  filter: ['all', ['==', 'type', 'group']],
  layout: GROUPS_LAYOUT,
  paint: GROUPS_PAINT,
};

export const climbingLayers: LayerSpecification[] = [...routes, groups];
