import { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { routesLines } from './routesLines';
import { ferrataLayer, groupsLayer, gymsLayer } from './groupsLayer';
import { routesPoints } from './routesPoints';

export const climbingLayers: LayerSpecification[] = [
  ...routesLines,
  ...routesPoints,
  gymsLayer,
  ferrataLayer,
  groupsLayer,
];
