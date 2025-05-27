import { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { routesLines } from './routesLines';
import { groupsLayer } from './groupsLayer';
import { routesPoints } from './routesPoints';

export const climbingLayers: LayerSpecification[] = [
  ...routesLines,
  ...routesPoints,
  groupsLayer,
];
