import { BBox, FeatureCollection } from 'geojson';

const COUNT = 500;

export const optimizeGeojsonToGrid = (
  geojson: FeatureCollection,
  [west, south, east, north]: BBox,
): GeoJSON.FeatureCollection => {
  const intervalX = (east - west) / COUNT;
  const intervalY = (north - south) / COUNT;
  const grid = Array.from({ length: COUNT }, () =>
    Array.from({ length: COUNT }, () => null as GeoJSON.Feature | null),
  );

  for (const feature of geojson.features) {
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

  const features = grid.flat().filter((f) => f !== null) as GeoJSON.Feature[];

  return { type: 'FeatureCollection', features };
};
