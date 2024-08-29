import { getDaysTable, parseDaysPart } from '../getDaysTable';
import { buildDaysPart, buildString } from '../buildString';

jest.mock('../../../../../../services/intl', () => ({
  intl: { lang: 'en' },
  t: () => 'Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday',
}));

test('conversion', () => {
  const original = 'Mo-Fr 08:00-12:00,13:00-17:00; Sa 08:00-12:00';
  expect(buildString(getDaysTable(original))).toEqual(original);
});

test('24/7', () => {
  const original = '24/7';
  expect(buildString(getDaysTable(original))).toEqual(original);
});

describe('daysPart conversion', () => {
  test.each([
    { input: 'Mo,Th' },
    { input: 'Mo-Tu' },
    { input: 'Mo,Tu', output: 'Mo-Tu' },
    { input: 'Mo-We,Sa' },
    { input: 'Mo-We,Su' },
    { input: 'Su,Mo,We-Su', output: 'Mo,We-Su' },
    { input: 'We-Mo', output: 'Mo,We-Su' },
    { input: 'Su,Mo,We,Fr', output: 'Mo,We,Fr,Su' },
    { input: 'Su,Mo,We,Fr', output: 'Mo,We,Fr,Su' },
  ])('$input', ({ input, output }) => {
    const result = buildDaysPart(parseDaysPart(input));
    expect(result).toBe(output ?? input);
  });
});
