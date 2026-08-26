import OpeningHours from 'opening_hours';
import { DateRange, isMidnight, splitDateRangeAtMidnight } from './utils';
import { Address, SimpleOpeningHoursTable } from './types';
import { LonLat } from '../../../../services/types';
import { intl, t } from '../../../../services/intl';
import { addDays, isAfter, isEqual, set } from 'date-fns';
import uniq from 'lodash/uniq';

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

export const isImperialUnits = () =>
  !!JSON.parse(global?.window?.localStorage.getItem('userSettings') ?? '{}')
    ?.isImperial;

const fmtDate = (d: Date) =>
  d.toLocaleTimeString(intl.lang, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: isImperialUnits(),
  });

// midnight at the end of an interval is written as 24:00 (like in the OSM syntax), not as 0:00
const fmtMidnightAsEndOfDay = (d: Date) =>
  new Intl.DateTimeFormat(intl.lang, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  })
    .formatToParts(d)
    .map(({ type, value }) => (type === 'hour' ? '24' : value))
    .join('');

const fmtEndDate = (d: Date) =>
  isMidnight(d) && !isImperialUnits() ? fmtMidnightAsEndOfDay(d) : fmtDate(d);

const fmtDateRange = ([start, end]: DateRange) => {
  if (isMidnight(start) && isMidnight(end)) {
    return t('opening_hours.all_day');
  }

  return `${fmtDate(start)}-${fmtEndDate(end)}`;
};

const getMinsDiff = (date: Date) =>
  Math.round((date.getTime() - new Date().getTime()) / 60000);

export type Status = 'opens-soon' | 'closes-soon' | 'opened' | 'closed';

type OpenInterval = [Date, Date, boolean, string];

const getStatus = (interval: OpenInterval | null): Status => {
  if (!interval) {
    return 'closed';
  }

  const opensInMins = getMinsDiff(interval[0]);
  const closesInMins = getMinsDiff(interval[1]);

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

const splitByDay = (interval: DateRange) =>
  splitDateRangeAtMidnight(interval, (d1, d2) => {
    const splitPoint = set(addDays(new Date(d1), 1), {
      hours: 5,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    return isEqual(d2, splitPoint) || isAfter(d2, splitPoint);
  });

const getDaysTable = (intervals: OpenInterval[], until: Date) => {
  const splittedIntervals = intervals
    .flatMap(([openingDate, endDate]) => splitByDay([openingDate, endDate]))
    .filter(([from]) => from < until);

  const grouped = WEEKDAYS.map((w) => {
    const daysIntervals = splittedIntervals.filter(
      ([from]) =>
        w === weekdayMappings[from.toLocaleString('en', { weekday: 'short' })],
    );

    return [w, daysIntervals.map(fmtDateRange)] as const;
  });

  return Object.fromEntries(grouped) as unknown as SimpleOpeningHoursTable;
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

  // one day extra, otherwise an interval crossing the last midnight would be cut off there
  const queryEnd = new Date(oneWeekLater);
  queryEnd.setDate(queryEnd.getDate() + 1);

  const allIntervals = oh.getOpenIntervals(today, queryEnd);
  const intervals = allIntervals.filter(([_, __, maybe]) => !maybe);
  const daysTable = getDaysTable(intervals, oneWeekLater);

  // intervals are sorted from the present to the future
  // so the first one is either currently opened or the next opened slot
  const relevantInterval = intervals.find(
    ([, endDate]) => endDate > new Date(),
  );

  const maybeOpenedReasons = allIntervals
    .filter(([from, __, maybe]) => maybe && from < oneWeekLater)
    .map((interval) => interval[3]);

  return {
    daysTable,
    status: getStatus(relevantInterval),
    maybeReasons: uniq(maybeOpenedReasons),
  };
};
