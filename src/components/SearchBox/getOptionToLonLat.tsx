import { Option } from './types';

export const getOptionToLonLat = (option: Option) => {
  if (option.type === 'coords') {
    return option.coords.center;
  }

  if (option.type === 'star') {
    return option.star.center;
  }

  if (option.type === 'geocoder') {
    return option.geocoder.geometry.coordinates;
  }

  throw new Error(`Unsupported option type: ${option.type}`);
};
