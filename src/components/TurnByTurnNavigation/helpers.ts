import React from 'react';
import { LonLat } from '../../services/types';
import { EARTH_RADIUS, getDistance } from '../SearchBox/utils';
import { zip } from 'lodash';

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

export const useLocation = () => {
  const [location, setLocation] = React.useState<GeolocationPosition>(null);

  React.useEffect(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(setLocation);
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return location;
};

type Orientation = Record<
  'alpha' | 'beta' | 'gamma' | 'webkitCompassHeading',
  number
>;

export const useOrientation = () => {
  const [orientation, setOrientation] = React.useState<Orientation>({
    alpha: null,
    beta: null,
    gamma: null,
    webkitCompassHeading: null,
  });

  React.useEffect(() => {
    if (!window.DeviceOrientationEvent) return;

    const handleOrientation = ({
      alpha,
      beta,
      gamma,
      // @ts-ignore
      webkitCompassHeading,
    }: DeviceOrientationEvent) => {
      setOrientation({ alpha, beta, gamma, webkitCompassHeading });
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return orientation;
};

export const requestOrientationPermission = () => {
  // @ts-ignore
  if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
    // @ts-ignore
    return DeviceOrientationEvent.requestPermission().then(
      (state: string) => state === 'granted',
    );
  }
  return Promise.resolve(true);
};

export type Pair<T> = [T, T];

export const pair = <T>(arr: T[]) => zip(arr, arr.slice(1)).slice(0, -1);

export const unpair = <T>(pairs: Pair<T>[]) => {
  if (pairs.length === 0) {
    return [];
  }

  const [[first]] = pairs;
  const rest = pairs.map(([_, second]) => second);

  return [first, ...rest];
};

export const isInBetween = (range: [number, number], middle: number) => {
  const min = Math.min(...range);
  const max = Math.max(...range);

  return min <= middle && middle <= max;
};
