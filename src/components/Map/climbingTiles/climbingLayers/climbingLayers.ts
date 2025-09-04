import { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { routesLines } from './routesLines';
import { ferrataLayer, groupsLayer, gymsLayer } from './groupsLayer';
import { routesPoints } from './routesPoints';
import { CLIMBING_TILES_SOURCE } from '../consts';

export const climbingLayers: LayerSpecification[] = [
  ...routesLines,
  ...routesPoints,
  gymsLayer,
  ferrataLayer,
  groupsLayer,
  {
    id: 'climbing box',
    // metadata: { clickableWithOsmId: true },
    type: 'line',
    source: CLIMBING_TILES_SOURCE,
    filter: ['==', 'type', 'box'],
    layout: { 'line-cap': 'round' },
    paint: {
      'line-color': '#f60',
      'line-width': 2,
      // 'line-opacity': [
      //   'case',
      //   ['boolean', ['feature-state', 'hover'], false],
      //   1,
      //   0,
      // ],
    },
  },
];
