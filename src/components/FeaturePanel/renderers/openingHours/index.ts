import { parseComplexOpeningHours } from './complex';
import { parseSimpleOpeningHours } from './simple';

export const parseOpeningHours = (value: string) => {
  try {
    return parseComplexOpeningHours(value);
  } catch {
    return parseSimpleOpeningHours(value);
  }
};
