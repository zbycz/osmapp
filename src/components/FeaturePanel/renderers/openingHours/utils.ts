type DateRange = [Date, Date];

export function splitDateRangeAtMidnight([
  startDate,
  endDate,
]: DateRange): DateRange[] {
  const isSameDay = (date1: Date, date2: Date) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  const midnight = new Date(startDate);
  midnight.setHours(0, 0, 0, 0);
  midnight.setDate(midnight.getDate() + 1);

  if (startDate.getTime() === endDate.getTime()) {
    return [];
  }

  if (isSameDay(startDate, endDate)) {
    return [[startDate, endDate]];
  }

  return [
    [startDate, midnight],
    ...splitDateRangeAtMidnight([midnight, endDate]),
  ];
}
