import { LonLat } from '../../services/types';
import { encodeUrl } from '../../helpers/utils';
import { getOptionLabel, getOptionToLonLat } from './DirectionsAutocomplete';

export const splitByFirstTilda = (str: string) => {
  if (!str) {
    return [undefined, undefined];
  }
  const index = str.indexOf('~');
  if (index === -1) {
    return [str, undefined];
  }
  return [str.slice(0, index), str.slice(index + 1)];
};

export type Option = Record<string, any>; // TODO once we have types in SearchBox

export const getStarOption = (center: LonLat, label?: string): Option => ({
  star: {
    center,
    label: label || center,
  },
});

const getOptionToUrl = (point: Option) => {
  const lonLat = getOptionToLonLat(point);
  return `${lonLat.join(',')}~${getOptionLabel(point)}`;
};

export const buildUrl = (mode: 'car' | 'bike' | 'walk', points: Option[]) => {
  const urlParts = points.map(getOptionToUrl);
  return encodeUrl`/directions/${mode}/${urlParts[0]}/${urlParts[1]}`;
};

const urlCoordsToLonLat = (coords: string): LonLat =>
  coords.split(',').map(Number);

export const parseUrlParts = (urlParts: string[]): Option[] =>
  urlParts.map((urlPart) => {
    const [coords, label] = splitByFirstTilda(urlPart);
    return getStarOption(urlCoordsToLonLat(coords), label);
  });
