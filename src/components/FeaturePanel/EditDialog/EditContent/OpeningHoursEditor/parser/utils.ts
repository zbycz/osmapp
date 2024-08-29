import { buildDaysPart, buildString } from './buildString';
import { getDaysTable, parseDaysPart } from './getDaysTable';
import { publishDbgObject } from '../../../../../../utils';

const sanitizeDaysParts = (value: string) => {
  return (value ?? '')
    .split(/ *; */)
    .map((part) => {
      if (part.match(/^((Mo|Tu|We|Th|Fr|Sa|Su)[-, ]*)+/)) {
        const [daysPart, timePart] = part.split(' ', 2);
        const sanitizedDays = buildDaysPart(parseDaysPart(daysPart));
        return (
          (sanitizedDays === 'Mo-Su' ? '' : `${sanitizedDays} `) + `${timePart}`
        );
      }
      return part;
    })
    .join('; ');
};

export const canEditorHandle = (value: string | undefined) => {
  const built = buildString(getDaysTable(value));
  const sanitized = sanitizeDaysParts(value);
  publishDbgObject('canEditorHandle', { built, sanitized });

  return built === sanitized;
};
