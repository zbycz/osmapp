import { BBox } from 'geojson';
import { CTFeature } from '../../types';

// rows or columns count
const COUNT = 500;

const optimizeFeaturesToGrid = (
  features: CTFeature[],
  [west, south, east, north]: BBox,
): CTFeature[] => {
  const intervalX = (east - west) / COUNT;
  const intervalY = (north - south) / COUNT;
  const grid = Array.from({ length: COUNT }, () =>
    Array.from({ length: COUNT }, () => null as CTFeature | null),
  );

  for (const feature of features) {
    if (!feature.geometry || feature.geometry.type !== 'Point') {
      continue;
    }

    const [lon, lat] = feature.geometry.coordinates;

    if (lon >= west && lon <= east && lat >= south && lat <= north) {
      const xIndex = Math.floor((lon - west) / intervalX);
      const yIndex = Math.floor((lat - south) / intervalY);
      const current = grid[xIndex][yIndex];
      const shouldReplaceCell =
        !current ||
        !current.properties.osmappRouteCount ||
        current.properties.osmappRouteCount <
          feature.properties.osmappRouteCount;

      if (shouldReplaceCell) {
        grid[xIndex][yIndex] = feature;
      }
    }
  }

  return grid.flat().filter((f) => f !== null);
};

export const buildTileGeojson = (
  isOptimizedToGrid: boolean,
  featuresInBbox: CTFeature[],
  bbox: BBox,
): GeoJSON.FeatureCollection => {
  const features = isOptimizedToGrid
    ? optimizeFeaturesToGrid(featuresInBbox, bbox)
    : featuresInBbox;

  return {
    type: 'FeatureCollection' as const,
    features,
  };
};
