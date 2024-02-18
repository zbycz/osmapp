import type { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { overpassLayers } from './overpassLayers';

export const climbingLayers: LayerSpecification[] = [
  ...overpassLayers.map(
    (layer) =>
      ({
        ...layer,
        id: `climbing-${layer.id}`,
        source: 'climbing',
      } as LayerSpecification),
  ),
  // override specific settings for climbing here
];
