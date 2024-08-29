import { DaysTable, Slot } from './types';

const ucFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const DAYS_ORDER = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

const getInterval = (start: number, end: number) => {
  return start === end
    ? ucFirst(DAYS_ORDER[start])
    : `${ucFirst(DAYS_ORDER[start])}-${ucFirst(DAYS_ORDER[end])}`;
};

export const buildDaysPart = (days: string[]) => {
  const daysBitmap = DAYS_ORDER.map((day) => days.includes(day));

  const result = [];
  let start = -1;
  for (let i = 0; i < 7; i++) {
    if (daysBitmap[i] && start === -1) {
      start = i;
    } else if (start >= 0 && !daysBitmap[i]) {
      result.push(getInterval(start, i - 1));
      start = -1;
    }
  }
  if (start >= 0) {
    result.push(getInterval(start, 6));
  }

  return result.join(',');
};

const isValidTime = (from: string) =>
  from.match(/^(2[0-4]|[01]?[0-9]):([0-5][0-9])$/) !== null;

export const isValid = (slot: Slot) =>
  isValidTime(slot.from) && isValidTime(slot.to);

const isNonstop = (daysByTimepart: Record<string, string[]>) => {
  const count1 = daysByTimepart['00:00-24:00']?.length ?? 0;
  const count2 = daysByTimepart['0:00-24:00']?.length ?? 0;
  return count1 + count2 >= 7;
};

const isFullWeek = (daysByTimepart: Record<string, string[]>) => {
  const values = Object.values(daysByTimepart);
  return values.length === 1 && values[0].length === 7;
};

export const buildString = (daysTable: DaysTable) => {
  const daysByTimepart = {} as Record<string, string[]>;
  daysTable.forEach(({ day, timeSlots }) => {
    const timePart = timeSlots
      .filter(isValid)
      .map(({ from, to }) => `${from}-${to}`)
      .join(',');
    if (timePart) {
      (daysByTimepart[timePart] ??= []).push(day);
    }
  });

  if (isNonstop(daysByTimepart)) {
    return '24/7';
  }

  if (isFullWeek(daysByTimepart)) {
    return Object.keys(daysByTimepart)[0];
  }

  return Object.entries(daysByTimepart)
    .map(([timePart, days]) => {
      const daysPart = buildDaysPart(days);
      return `${daysPart} ${timePart}`;
    })
    .join('; ')
    .trim();
};
