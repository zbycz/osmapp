import { BBox, Geometry } from 'geojson';
import { ClimbingTilesFeature, ClimbingTilesProperties } from '../../types';
import { ClimbingFeaturesRecord } from './db';
import { OsmId } from '../../services/types';

// rows or columns count
const COUNT = 500;

const optimizeFeaturesToGrid = (
  features: ClimbingTilesFeature[],
  [west, south, east, north]: BBox,
): ClimbingTilesFeature[] => {
  const intervalX = (east - west) / COUNT;
  const intervalY = (north - south) / COUNT;
  const grid = Array.from({ length: COUNT }, () =>
    Array.from({ length: COUNT }, () => null as ClimbingTilesFeature | null),
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
        !current.properties.routeCount ||
        current.properties.routeCount < feature.properties.routeCount;

      if (shouldReplaceCell) {
        grid[xIndex][yIndex] = feature;
      }
    }
  }

  return grid.flat().filter((f) => f !== null);
};

const convertOsmIdToMapId = (apiId: OsmId) => {
  const osmToMapType = { node: 0, way: 1, relation: 4 };
  return parseInt(`${apiId.id}${osmToMapType[apiId.type]}`, 10);
};

const buildGeojson = (record: ClimbingFeaturesRecord): ClimbingTilesFeature => {
  const { type, osmType, osmId, line, lon, lat } = record;
  const id = convertOsmIdToMapId({ type: osmType, id: osmId });

  const geometry: Geometry = line
    ? { type: 'LineString', coordinates: line }
    : { type: 'Point', coordinates: [lon, lat] };

  const { routeCount, hasImages, gradeId, histogramCode } = record;
  const name = record.name || record.nameRaw;
  const properties: ClimbingTilesProperties =
    type === 'area' || type === 'crag'
      ? { type, name, routeCount: routeCount ?? 0, hasImages, histogramCode }
      : type === 'gym' || type === 'ferrata'
        ? { type, name }
        : type === 'route' || type === 'route_top'
          ? { type, name, gradeId }
          : undefined;

  return { type: 'Feature', id, geometry, properties };
};

export const buildTileGeojson = (
  isOptimizedToGrid: boolean,
  recordsInBbox: ClimbingFeaturesRecord[],
  bbox: BBox,
): GeoJSON.FeatureCollection => {
  const featuresInBbox = recordsInBbox.map(buildGeojson);

  const features = isOptimizedToGrid
    ? optimizeFeaturesToGrid(featuresInBbox, bbox)
    : featuresInBbox;

  return {
    type: 'FeatureCollection' as const,
    features,
  };
};
