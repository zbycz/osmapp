import { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { CLIMBING_TILES_SOURCE } from '../consts';
import { linear } from './helpers';

export const routesPoints: LayerSpecification[] = [
  {
    id: 'climbing route (circle)',
    metadata: { clickableWithOsmId: true },
    type: 'circle',
    source: CLIMBING_TILES_SOURCE,
    minzoom: 13,
    filter: ['all', ['==', 'type', 'route'], ['==', '$type', 'Point']],
    paint: {
      'circle-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#000',
        ['coalesce', ['get', 'color'], '#999'],
      ],
      'circle-radius': linear(16, 1, 21, 6),
      'circle-opacity': linear(16, 0.4, 21, 1),
      'circle-stroke-color': '#f8f4f0',
      'circle-stroke-width': linear(16, 0.4, 21, 1.2),
    },
  },
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
      'text-field': '{osmappLabel}',
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
