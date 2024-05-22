import OpeningHours from 'opening_hours';
import { isInRange } from './utils';
import { Address, SimpleOpeningHoursTable } from './types';
import { LonLat } from '../../../../services/types';

type Weekday = keyof SimpleOpeningHoursTable;
const weekdays: Weekday[] = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa', 'ph'];
const weekdayMappings: Record<string, Weekday> = {
  Sun: 'su',
  Mon: 'mo',
  Tue: 'tu',
  Wed: 'we',
  Thu: 'th',
  Fri: 'fr',
  Sat: 'sa',
};

const fmtDate = (d: Date) =>
  d.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });

export const parseComplexOpeningHours = (
  value: string,
  [lon, lat]: LonLat,
  address: Address,
) => {
  const oh = new OpeningHours(value, {
    lat,
    lon,
    address,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);

  const intervals = oh.getOpenIntervals(today, oneWeekLater);
  const grouped = weekdays.map((w) => {
    const daysIntervals = intervals.filter(
      ([from]) =>
        w === weekdayMappings[from.toLocaleString('en', { weekday: 'short' })],
    );

    return [w, daysIntervals] as const;
  });

  const daysTable = Object.fromEntries(
    grouped.map((entry) => {
      const strings = entry[1].map(
        ([from, due]) => `${fmtDate(from)}-${fmtDate(due)}`,
      );

      return [entry[0], strings] as const;
    }),
  ) as unknown as SimpleOpeningHoursTable;

  return {
    daysTable,
    isOpen: intervals.some(([from, due]) => isInRange([from, due], new Date())),
  };
};
