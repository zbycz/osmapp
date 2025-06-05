import type { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { climbingLayers } from './climbingLayers/climbingLayers';

export const climbingFilterTypes = [
  'gym',
  'viaFerrata',
  'rockClimbing',
] as const;

export type ClimbingFilterType = (typeof climbingFilterTypes)[number][];
export type ClimbingFilters = { type: Array<ClimbingFilterType> };
