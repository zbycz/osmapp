import { parseComplexOpeningHours } from './complex';
import { Address } from './types';

export const parseOpeningHours = (
  value: string,
  lat: number,
  lon: number,
  address: Address,
): ReturnType<typeof parseComplexOpeningHours> | null => {
  try {
    return parseComplexOpeningHours(value, lat, lon, address);
  } catch {
    return null;
  }
};
