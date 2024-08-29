import { intl, t } from '../../../../../../services/intl';
import { Day, DaysTable, Slot } from './types';

const OSM_DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
const WEEK_DAYS = t('opening_hours.days_su_mo_tu_we_th_fr_sa').split('|');

const reorderAccordingToLocale = (timesByDay: Day[]) => {
  const locale = new Intl.Locale(intl.lang) as unknown as any;
  const firstDayIdx = (locale.weekInfo?.firstDay ?? 7) % 7;
  return [
    ...timesByDay.slice(firstDayIdx),
    ...timesByDay.slice(0, firstDayIdx),
  ];
};

export const getEmptyValue = () =>
  reorderAccordingToLocale(
    OSM_DAYS.map((day, idx) => ({
      day,
      dayLabel: WEEK_DAYS[idx],
      timeSlots: [],
    })),
  );

const getTimeSlots = (timePart: string) =>
  timePart.split(',').map((time: string, slot: number) => {
    const [from, to = ''] = time.split('-');
    return { slotIdx: slot, from, to } as Slot;
  });

export const parseDaysPart = (daysPart: string): string[] => {
  const daysBitmap = new Array(7).fill(false);

  daysPart
    .toLowerCase()
    .split(',')
    .forEach((dayOrInterval) => {
      const interval = dayOrInterval.split('-');

      if (interval.length === 1) {
        const idx = OSM_DAYS.indexOf(interval[0]);
        if (idx !== -1) {
          daysBitmap[idx] = true;
        }
      } else {
        const start = OSM_DAYS.indexOf(interval[0]);
        const end = OSM_DAYS.indexOf(interval[1]);
        if (start !== -1 && end !== -1) {
          const endBigger = end < start ? end + 7 : end;
          for (let i = start; i <= endBigger; i++) {
            daysBitmap[i % 7] = true;
          }
        }
      }
    });

  return OSM_DAYS.filter((_, i) => daysBitmap[i]);
};

const INTERVAL_REGEXP =
  /^(2[0-4]|[01]?[0-9]):[0-5][0-9]-(2[0-4]|[01]?[0-9]):[0-5][0-9]/;

const getDaysMap = (value: string) => {
  const daysMap = {} as Record<string, Slot[]>;

  if (value === '24/7') {
    OSM_DAYS.forEach((day) => {
      daysMap[day] = [{ slotIdx: 0, from: '00:00', to: '24:00' }];
    });
    return daysMap;
  }

  if (value.match(INTERVAL_REGEXP)) {
    OSM_DAYS.forEach((day) => {
      daysMap[day] = getTimeSlots(value);
    });
    return daysMap;
  }

  value.split(/ *; */).forEach((part) => {
    const [daysPart, timePart = ''] = part.split(' ', 2);
    const days = parseDaysPart(daysPart);
    days.forEach((day) => {
      daysMap[day] = getTimeSlots(timePart);
    });
  });

  return daysMap;
};

export const getDaysTable = (value: string | undefined): DaysTable => {
  const daysMap = getDaysMap(value ?? '');

  const timesByDay = OSM_DAYS.map(
    (osmDay) =>
      ({
        day: osmDay,
        dayLabel: WEEK_DAYS[OSM_DAYS.indexOf(osmDay)],
        timeSlots: daysMap[osmDay] ?? [],
      }) as Day,
  );

  return reorderAccordingToLocale(timesByDay);
};
