import { SimpleOpeningHours } from 'simple-opening-hours';
import { SimpleOpeningHoursTable } from './types';

export const parseSimpleOpeningHours = (value: string) => {
  const sanitized = value.match(/^[0-9:]+-[0-9:]+$/) ? `Mo-Su ${value}` : value;
  const opening = new SimpleOpeningHours(sanitized);
  const daysTable = opening.getTable() as SimpleOpeningHoursTable;
  const isOpen = opening.isOpenNow();
  return { daysTable, isOpen };
};
