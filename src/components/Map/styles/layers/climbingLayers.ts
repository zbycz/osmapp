import type { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';

export const climbingLayers: LayerSpecification[] = [
  // ...overpassLayers.map(
  //   (layer) =>
  //     ({
  //       ...layer,
  //       id: `climbing-${layer.id}`,
  //       source: 'climbing',
  //     } as LayerSpecification),
  // ),
  // override specific settings for climbing here

  {
    id: 'climbing-level-3',
    type: 'symbol',
    source: 'climbing',
    minzoom: 16,
    filter: [
      'all'
    ],
    layout: {
      'text-padding': 2,
      'text-font': ['Noto Sans Regular'],
      'text-anchor': 'top',
      'icon-image': '{class}_11',
      'text-field': '{name:latin}\n{name:nonlatin}',
      'text-offset': [0, 0.6],
      'text-size': 12,
      'text-max-width': 9,
    },
    paint: {
      'text-halo-blur': 0.5,
      'text-color': '#666',
      'text-halo-width': 1,
      'text-halo-color': '#ffffff',
    },
  },
];
