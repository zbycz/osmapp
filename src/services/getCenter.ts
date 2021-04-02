import { FeatureGeometry, isPoint, isWay, Position } from './types';

const getBbox = (coordinates: Position[]) => {
  const [firstX, firstY] = coordinates[0];
  const initialBbox = { w: firstX, s: firstY, e: firstX, n: firstY };

  return coordinates.reduce(
    ({ w, s, e, n }, [x, y]) => ({
      w: Math.min(w, x),
      s: Math.min(s, y),
      e: Math.max(e, x),
      n: Math.max(n, y),
    }),
    initialBbox,
  );
};

export const getCenter = (geometry: FeatureGeometry): Position => {
  if (isPoint(geometry)) {
    return geometry.coordinates;
  }

  if (isWay(geometry)) {
    const { w, s, e, n } = getBbox(geometry.coordinates); // [WSEN]
    const lon = (w + e) / 2; // flat earth rulezz
    const lat = (s + n) / 2;
    return [lon, lat];
  }

  // relation
  return undefined;
};
