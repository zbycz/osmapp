import { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { CLIMBING_TILES_SOURCE } from '../consts';

export const routesLines: LayerSpecification[] = [
  {
    id: 'climbing route (line) - casing',
    metadata: { clickableWithOsmId: true },
    type: 'line',
    source: CLIMBING_TILES_SOURCE,
    minzoom: 13,
    filter: ['all', ['==', 'type', 'route']],
    layout: { 'line-cap': 'round' },
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
    layout: { 'line-cap': 'round' },
    paint: {
      'line-color': ['coalesce', ['get', 'color'], '#999'],
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
    layout: { 'line-cap': 'round' },
    paint: {
      'line-color': '#000',
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
    metadata: { clickableWithOsmId: true },
    type: 'symbol',
    source: CLIMBING_TILES_SOURCE,
    filter: ['all', ['==', 'type', 'route']],
    layout: {
      'symbol-placement': 'line-center',
      'text-font': ['Noto Sans Regular'],
      'text-field': '{label}',
      'text-size': 12,
      'text-rotation-alignment': 'map',
    },
    paint: {
      'text-color': '#000000',
      'text-halo-width': 1.5,
      'text-halo-color': 'rgba(255,255,255,0.7)',
    },
  },
];
