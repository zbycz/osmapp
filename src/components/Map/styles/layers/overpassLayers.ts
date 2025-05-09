import type { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';

export const overpassLayers: LayerSpecification[] = [
  {
    id: 'overpass-line-casing',
    type: 'line',
    source: 'overpass',
    paint: {
      'line-color': '#f8f4f0',
      'line-width': 4,
    },
  } as LayerSpecification,
  {
    id: 'overpass-line',
    type: 'line',
    source: 'overpass',
    paint: {
      'line-color': '#f00',
      'line-width': 1.5,
      'line-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        1,
      ],
    },
  } as LayerSpecification,
  {
    id: 'overpass-line-text',
    type: 'symbol',
    source: 'overpass',
    filter: ['all', ['in', '$type', 'LineString']],
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
  // -- commented out until this is fixed https://github.com/zbycz/osmapp/issues/739
  // -- related: preprocess the data to tell polygons from lines, see https://github.com/zbycz/osmapp/issues/974
  // {
  //   id: 'overpass-fill',
  //   type: 'fill',
  //   source: 'overpass',
  //   filter: ['all', ['==', '$type', 'Polygon']],
  //   paint: {
  //     'fill-color': '#f00',
  //     'fill-opacity': [
  //       'case',
  //       ['boolean', ['feature-state', 'hover'], false],
  //       0.2,
  //       0.5,
  //     ],
  //   },
  // } as LayerSpecification,
  {
    id: 'overpass-polygon-text',
    type: 'symbol',
    source: 'overpass',
    filter: ['all', ['in', '$type', 'Polygon']],
    layout: {
      'symbol-placement': 'point',
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
    id: 'overpass-circle',
    type: 'circle',
    source: 'overpass',
    filter: ['all', ['==', '$type', 'Point'], ['!=', 'osmappType', 'relation']],
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
  } as LayerSpecification,
  {
    // just for wider clicking area
    id: 'overpass-circle-relation-click-area',
    type: 'circle',
    source: 'overpass',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'osmappType', 'relation']],
    paint: {
      'circle-color': 'rgba(255,255,255,0)',
      'circle-radius': 20,
    },
  } as LayerSpecification,
  {
    id: 'overpass-circle-relation',
    type: 'circle',
    source: 'overpass',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'osmappType', 'relation']],
    paint: {
      'circle-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#4150a0',
        '#ea5540',
      ],
      'circle-radius': 6,
    },
  } as LayerSpecification,

  {
    id: 'overpass-symbol',
    type: 'symbol',
    source: 'overpass',
    filter: ['all', ['==', '$type', 'Point'], ['!=', 'osmappType', 'relation']],
    layout: {
      'text-padding': 2,
      'text-font': ['Noto Sans Regular'],
      'text-anchor': 'top',
      'icon-image': '{class}_11',
      'text-field': '{name}',
      'text-offset': [0, 0.6],
      'text-size': 12,
      'text-max-width': 9,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
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
  } as LayerSpecification,
];
