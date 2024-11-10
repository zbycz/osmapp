import { LonLat } from '../../services/types';
import { EARTH_RADIUS, getDistance } from '../SearchBox/utils';

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;
const radiansToDegrees = (radians: number) => radians * (180 / Math.PI);

const lonLatToCartesian = ([lon, lat]: LonLat) => {
  const latRad = degreesToRadians(lat);
  const lonRad = degreesToRadians(lon);

  return {
    x: EARTH_RADIUS * Math.cos(latRad) * Math.cos(lonRad),
    y: EARTH_RADIUS * Math.cos(latRad) * Math.sin(lonRad),
    z: EARTH_RADIUS * Math.sin(latRad),
  };
};

const cartesianToLonLat = ({
  x,
  y,
  z,
}: Record<'x' | 'y' | 'z', number>): LonLat => [
  radiansToDegrees(Math.atan2(y, x)),
  radiansToDegrees(Math.asin(z / EARTH_RADIUS)),
];

export const getSubPoints = (
  [p0, p1]: [LonLat, LonLat],
  segmentLength: number,
) => {
  const distance = getDistance(p0, p1);
  if (distance < segmentLength) {
    return [p0, p1];
  }

  const numberOfPoints = Math.round(distance / segmentLength);

  const cartesianP0 = lonLatToCartesian(p0);
  const cartesianP1 = lonLatToCartesian(p1);

  return Array.from({ length: numberOfPoints + 1 }, (_, i) => {
    const f = i / numberOfPoints;
    const calc = (key: 'x' | 'y' | 'z') =>
      cartesianP0[key] * (1 - f) + cartesianP1[key] * f;

    return cartesianToLonLat({
      x: calc('x'),
      y: calc('y'),
      z: calc('z'),
    });
  });
};

export const calcDistance = (path: LonLat[]) => {
  return path.slice(1).reduce((distance, point, index) => {
    const prevPoint = path[index];
    return distance + getDistance(point, prevPoint);
  }, 0);
};
