import { buildDaysPart, buildString } from './buildString';
import { getDaysTable, parseDaysPart } from './getDaysTable';
import { publishDbgObject } from '../../../../../../../utils';

const splitByFirstSpace = (str: string) => {
  const index = str.indexOf(' ');
  return [str.slice(0, index), str.slice(index + 1)];
};

const sanitizeDaysParts = (value: string) => {
  return value
    .split(/ *; */)
    .map((part) => {
      if (part.match(/^(Mo|Tu|We|Th|Fr|Sa|Su) off$/)) {
        return false;
      }
      if (part.match(/^((Mo|Tu|We|Th|Fr|Sa|Su)[-, ]*)+/)) {
        const [daysPart, timePart] = splitByFirstSpace(part);
        const days = parseDaysPart(daysPart);
        const sanitizedDays = buildDaysPart(days);

        if (sanitizedDays === 'Mo-Su' && timePart.match(/^0?0:00-24:00$/)) {
          return '24/7';
        }
        if (sanitizedDays === 'Mo-Su') {
          return timePart;
        }
        return `${sanitizedDays} ${timePart}`;
      }
      return part;
    })
    .filter(Boolean)
    .join('; ')
    .replace(/ *, */g, ',')
    .trim();
};

export const canItHandle = (value: string | undefined) => {
  const built = buildString(getDaysTable(value ?? ''));
  const sanitized = sanitizeDaysParts(value ?? '');
  publishDbgObject('last canItHandle', { built, sanitized });

  return built === sanitized;
};
