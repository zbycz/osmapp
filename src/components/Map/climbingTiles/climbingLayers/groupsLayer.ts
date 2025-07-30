import {
  byHasImages,
  hover,
  ifCrag,
  linear,
  linearByRouteCount,
  sortKey,
} from './helpers';
import {
  LayerSpecification,
  SymbolLayerSpecification,
} from '@maplibre/maplibre-gl-style-spec';
import { AREA, CLIMBING_TILES_SOURCE, CRAG, GYM, VIA_FERRATA } from '../consts';

const areaSize = linearByRouteCount(0, 0.4, 400, 1);
const cragSize = linearByRouteCount(0, 0.4, 50, 0.7);
const cragSizeBig = 0.7;

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
    ifCrag(15, 14),
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

export const groupsLayer: LayerSpecification = {
  id: 'climbing group',
  metadata: { clickableWithOsmId: true },
  type: 'symbol',
  source: CLIMBING_TILES_SOURCE,
  maxzoom: 20,
  filter: ['all', ['in', 'type', 'area', 'crag']],
  layout: GROUPS_LAYOUT,
  paint: {
    'icon-opacity': hover(1, 0.6),
    'text-opacity': hover(1, 0.6),
    'text-color': ifCrag(
      byHasImages(CRAG, 'COLOR'),
      byHasImages(AREA, 'COLOR'),
    ),
    'text-halo-color': '#ffffff',
    'text-halo-width': 2,
  },
};

export const gymsLayer: LayerSpecification = {
  ...groupsLayer,
  id: 'climbing gym',
  filter: ['all', ['==', 'type', 'gym']],
  minzoom: 9,
  maxzoom: 24,
  layout: {
    ...groupsLayer.layout,
    'icon-image': GYM.IMAGE,
  },
};

export const ferrataLayer: LayerSpecification = {
  ...groupsLayer,
  id: 'climbing via_ferrata',
  filter: ['all', ['==', 'type', 'ferrata']],
  layout: {
    ...groupsLayer.layout,
    'icon-image': VIA_FERRATA.IMAGE,
  },
};
