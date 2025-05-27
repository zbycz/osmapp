import { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { CLIMBING_TILES_SOURCE } from '../consts';
import { linear } from './helpers';

export const routes: LayerSpecification[] = [
  {
    id: 'climbing route (line) - casing',
    metadata: { clickableWithOsmId: true },
    type: 'line',
    source: CLIMBING_TILES_SOURCE,
    minzoom: 13,
    filter: ['all', ['==', 'type', 'route']],
    layout: {
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#f8f4f0',
      'line-width': 4,
    },
  },
  {
    id: 'climbing route (line)',
    metadata: { clickableWithOsmId: true },
    type: 'line',
    source: CLIMBING_TILES_SOURCE,
    minzoom: 13,
    filter: ['all', ['==', 'type', 'route']],
    layout: {
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#ea5540',
      'line-width': 2,
    },
  },
  {
    id: 'climbing route (line) - hover',
    metadata: { clickableWithOsmId: true },
    type: 'line',
    source: CLIMBING_TILES_SOURCE,
    minzoom: 13,
    filter: ['all', ['==', 'type', 'route']],
    layout: {
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#4150a0',
      'line-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        1,
        0,
      ],
      'line-width': 2,
    },
  },
  {
    id: 'climbing route (line) - text',
    type: 'symbol',
    source: CLIMBING_TILES_SOURCE,
    filter: ['all', ['==', 'type', 'route']],
    layout: {
      'symbol-placement': 'line-center',
      'text-font': ['Noto Sans Regular'],
      'text-field': '{name}',
      'text-size': 12,
      'text-rotation-alignment': 'map',
    },
    paint: {
      'text-color': '#000000',
      'text-halo-width': 1.5,
      'text-halo-color': 'rgba(255,255,255,0.7)',
      'text-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        1,
      ],
    },
  } as LayerSpecification,
  {
    id: 'climbing route (circle)',
    metadata: { clickableWithOsmId: true },
    type: 'circle',
    source: CLIMBING_TILES_SOURCE,
    minzoom: 16,
    filter: ['all', ['==', 'type', 'route'], ['==', '$type', 'Point']],
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
