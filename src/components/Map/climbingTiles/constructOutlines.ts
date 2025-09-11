import { ClimbingTilesFeature } from '../../../types';
import {
  bbox,
  buffer,
  convex,
  distance,
  featureCollection,
  lineString,
  polygonSmooth,
} from '@turf/turf';
import { Feature as GeojsonFeature, LineString, Polygon } from 'geojson';

const getMeasures = (hull: GeojsonFeature<Polygon | LineString>) => {
  const [minX, minY, maxX, maxY] = bbox(hull);
  const width = maxX - minX;
  const height = maxY - minY;
  const maxDimension = Math.max(width, height);

  const meters = distance([minX, minY], [maxX, maxY], { units: 'meters' });
  const minZoom = Math.log2((5 * 40075016) / (meters * 256));

  return { maxDimension, minZoom };
};

const getHullForSubfeatures = (
  features: ClimbingTilesFeature[],
  mapId: number,
) => {
  const relationId = Math.floor(mapId / 10);
  const subfeatures = features.filter(
    (f) => f.properties.parentId === relationId,
  );
  if (subfeatures.length <= 1) {
    return null;
  }

  const hull = convex(featureCollection(subfeatures));
  if (!hull) {
    // two points or colinear points --> make a straight line
    const coords = subfeatures.flatMap((f) =>
      f.geometry.type === 'Point' ? [f.geometry.coordinates] : [],
    );
    return lineString(coords);
  }
  return hull;
};

export const constructOutlines = (features: ClimbingTilesFeature[]) => {
  // takes ~ 10-90ms
  return features
    .filter(({ id }) => (id as number) % 10 === 4)
    .flatMap((relation) => {
      const mapId = relation.id as number;
      const hull = getHullForSubfeatures(features, mapId);
      if (!hull) {
        return [];
      }

      const { maxDimension, minZoom } = getMeasures(hull);
      const inflation = maxDimension * 0.1;
      const buffered = buffer(hull, inflation, { units: 'degrees' });
      const smooth = polygonSmooth(buffered, { iterations: 3 });

      return [
        {
          ...smooth.features[0],
          id: mapId,
          properties: {
            type: 'outline',
            minZoom,
          },
        } as GeojsonFeature<Polygon>,
      ];
    });
};
