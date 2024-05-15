export const isInRange = ([startDate, endDate]: [Date, Date], date: Date) =>
  date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime();
