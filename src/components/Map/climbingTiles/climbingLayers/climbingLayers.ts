import { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { routesLines } from './routesLines';
import { ferrataLayer, groupsLayer, gymsLayer } from './groupsLayer';
import { routesPoints } from './routesPoints';
import { outlinesLayer } from './outlinesLayer';

export const climbingLayers: LayerSpecification[] = [
  outlinesLayer,
  ...routesLines,
  ...routesPoints,
  gymsLayer,
  ferrataLayer,
  groupsLayer,
];
