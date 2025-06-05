import { LayerSpecification } from '@maplibre/maplibre-gl-style-spec';
import { routesLines } from './routesLines';
import { ferrataLayer, groupsLayer, gymsLayer } from './groupsLayer';
import { routesPoints } from './routesPoints';
import { ClimbingFilters } from '../climbingFiltersUtils';

export const filterMap: Record<string, Array<string>> = {
  // gym: ['climbing gym'],
  viaFerrata: ['climbing via_ferrata'],
  rockClimbing: ['climbing route', 'climbing group', 'climbing gym'],
} as const;

export const getClimbingLayers = (
  climbingFilters: ClimbingFilters,
): LayerSpecification[] => {
  const allLayers: LayerSpecification[] = [
    ...routesLines,
    ...routesPoints,
    // gymsLayer,
    ferrataLayer,
    groupsLayer,
  ];
  const activeClimbingLayers = climbingFilters.type.flatMap(
    (f) => filterMap[f],
  );
  return allLayers.filter((layer) =>
    activeClimbingLayers.some((prefix) => layer.id.startsWith(prefix)),
  );
};
