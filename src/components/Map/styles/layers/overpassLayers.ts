import { AnyLayer } from 'maplibre-gl';

export const overpassLayers: AnyLayer[] = [
  {
    id: 'overpass-line-casing',
    type: 'line',
    source: 'overpass',
    paint: {
      'line-color': '#f8f4f0',
      'line-width': 6,
    },
  },
  {
    id: 'overpass-line',
    type: 'line',
    source: 'overpass',
    paint: {
      'line-color': '#f00',
      'line-width': 2,
      'line-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        1,
      ],
    },
  },
  {
    id: 'overpass-line-text',
    type: 'symbol',
    source: 'overpass',
    layout: {
      'symbol-placement': 'line',
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
  },
  {
    id: 'overpass-fill',
    type: 'fill',
    source: 'overpass',
    filter: ['all', ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': '#f00',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.2,
        0.5,
      ],
    },
  },
  {
    id: 'overpass-circle',
    type: 'circle',
    source: 'overpass',
    filter: ['all', ['==', '$type', 'Point']],
    paint: {
      'circle-color': 'rgba(255,255,255,0.9)',
      'circle-radius': 12,
      'circle-stroke-width': 1,
      'circle-stroke-color': 'rgba(255,0,0,0.9)',
      'circle-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        1,
      ],
    },
  },
  {
    id: 'overpass-symbol',
    type: 'symbol',
    source: 'overpass',
    filter: ['all', ['==', '$type', 'Point']],
    layout: {
      'text-padding': 2,
      'text-font': ['Noto Sans Regular'],
      'text-anchor': 'top',
      'icon-image': '{class}_11',
      'text-field': '{name}',
      'text-offset': [0, 0.6],
      'text-size': 12,
      'text-max-width': 9,
      'icon-allow-overlap': false,
    },
    paint: {
      // 'text-halo-blur': 0.5,
      'text-color': '#000',
      'text-halo-width': 1.5,
      'text-halo-color': 'rgba(255,255,255,0.7)',
      'icon-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        1,
      ],
      'text-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        1,
      ],
    },
  },
];
