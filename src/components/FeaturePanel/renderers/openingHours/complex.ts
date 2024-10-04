import OpeningHours from 'opening_hours';
import { DateRange, isMidnight, splitDateRangeAtMidnight } from './utils';
import { Address, SimpleOpeningHoursTable } from './types';
import { LonLat } from '../../../../services/types';
import { intl, t } from '../../../../services/intl';
import { addDays, isAfter, isEqual, set } from 'date-fns';

type Weekday = keyof SimpleOpeningHoursTable;
const WEEKDAYS: Weekday[] = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa', 'ph'];
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
  d.toLocaleTimeString(intl.lang, { hour: 'numeric', minute: 'numeric' });

const fmtDateRange = ([start, end]: DateRange) => {
  if (isMidnight(start) && isMidnight(end)) {
    return t('opening_hours.all_day');
  }

  return `${fmtDate(start)}-${fmtDate(end)}`;
};

export type Status = 'opens-soon' | 'closes-soon' | 'opened' | 'closed';

const getStatus = (opensInMins: number, closesInMins: number): Status => {
  const isOpened = opensInMins <= 0 && closesInMins >= 0;

  if (!isOpened && opensInMins <= 15) {
    return 'opens-soon';
  }
  if (isOpened && closesInMins <= 15) {
    return 'closes-soon';
  }
  if (isOpened) {
    return 'opened';
  }

  return 'closed';
};

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
  const splittedIntervals = intervals.flatMap(([openingDate, endDate]) =>
    splitDateRangeAtMidnight([openingDate, endDate], (d1, d2) => {
      const splitPoint = set(addDays(new Date(d1), 1), {
        hours: 5,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });

      return isEqual(d2, splitPoint) || isAfter(d2, splitPoint);
    }),
  );

  const grouped = WEEKDAYS.map((w) => {
    const daysIntervals = splittedIntervals.filter(
      ([from]) =>
        w === weekdayMappings[from.toLocaleString('en', { weekday: 'short' })],
    );

    return [w, daysIntervals] as const;
  });

  const daysTable = Object.fromEntries(
    grouped.map((entry) => {
      const strings = entry[1].map(fmtDateRange);

      return [entry[0], strings] as const;
    }),
  ) as unknown as SimpleOpeningHoursTable;

  const currently = new Date();
  const getMinsDiff = (date: Date) =>
    Math.round((date.getTime() - currently.getTime()) / 60000);
  // intervals are sorted from the present to the future
  // so the first one is either currently opened or the next opened slot
  const relevantInterval = intervals.find(([, endDate]) => endDate > currently);
  const opensInMins = relevantInterval ? getMinsDiff(relevantInterval[0]) : 0;
  const closesInMins = relevantInterval ? getMinsDiff(relevantInterval[1]) : 0;

  return {
    daysTable,
    status: getStatus(opensInMins, closesInMins),
  };
};
