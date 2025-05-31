import type { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { climbingLayers } from './climbingLayers/climbingLayers';

export const climbingFilterTypes = [
  'gym',
  'viaFerrata',
  'rockClimbing',
] as const;

export type ClimbingFilterType = (typeof climbingFilterTypes)[number][];
export type ClimbingFilters = { type: Array<ClimbingFilterType> };

export const filterMap = {
  gym: ['climbing gym'],
  viaFerrata: ['climbing via_ferrata'],
  rockClimbing: ['climbing route', 'climbing group', 'climbing gym'],
} as const;

export const addClimbingLayers = (
  climbingFilters: ClimbingFilters,
): LayerSpecification[] => {
  const activeClimbingLayers = climbingFilters.type.flatMap(
    (f) => filterMap[f],
  );
  return climbingLayers.filter((layer) =>
    activeClimbingLayers.some((prefix) => layer.id.startsWith(prefix)),
  );
};
