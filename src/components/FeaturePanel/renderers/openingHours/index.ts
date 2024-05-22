import { LonLat } from '../../../../services/types';
import { parseComplexOpeningHours } from './complex';
import { Address } from './types';

export const parseOpeningHours = (
  value: string,
  coords: LonLat,
  address: Address,
): ReturnType<typeof parseComplexOpeningHours> | null => {
  try {
    return parseComplexOpeningHours(value, coords, address);
  } catch {
    return null;
  }
};
