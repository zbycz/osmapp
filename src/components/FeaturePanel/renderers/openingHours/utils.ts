export type DateRange = [Date, Date];

const isSameDay = (date1: Date, date2: Date) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

export const isMidnight = (date: Date) =>
  date.getHours() === 0 &&
  date.getMinutes() === 0 &&
  date.getSeconds() === 0 &&
  date.getMilliseconds() === 0;

export function splitDateRangeAtMidnight(
  [startDate, endDate]: DateRange,
  shouldSplit = (d1: Date, d2: Date) => !isSameDay(d1, d2),
): DateRange[] {
  const midnight = new Date(startDate);
  midnight.setHours(0, 0, 0, 0);
  midnight.setDate(midnight.getDate() + 1);

  if (startDate.getTime() === endDate.getTime()) {
    return [];
  }

  if (!shouldSplit(startDate, endDate)) {
    return [[startDate, endDate]];
  }

  return [
    [startDate, midnight],
    ...splitDateRangeAtMidnight([midnight, endDate], shouldSplit),
  ];
}
