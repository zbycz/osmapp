import { getDaysTable, parseDaysPart } from '../getDaysTable';
import { buildDaysPart, buildString } from '../buildString';
import { canItHandle } from '../canItHandle';

jest.mock('../../../../../../../services/intl', () => ({
  intl: { lang: 'en' },
  t: () => 'Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday',
}));

test('conversion', () => {
  const original = ' Mo-Fr 08:00-12:00,13:00-17:00; Sa 08:00-12:00 ';
  expect(buildString(getDaysTable(original))).toEqual(original.trim());
  expect(canItHandle(original)).toBe(true);
});

test('24/7', () => {
  expect(buildString(getDaysTable('24/7'))).toEqual('24/7');
  expect(buildString(getDaysTable('Mo-Su 0:00-24:00'))).toEqual('24/7');
  expect(canItHandle('24/7')).toBe(true);
});

test('empty', () => {
  const original = '';
  expect(buildString(getDaysTable(original))).toEqual(original);
  expect(canItHandle(original)).toBe(true);
});

test('without days', () => {
  const original = '8:00-12:00,13:00-17:00';
  expect(buildString(getDaysTable(original))).toEqual(original);
  expect(canItHandle(original)).toBe(true);
});

describe('space after comma', () => {
  test.each([
    { input: '1:00-2:00, 5:00-7:00', output: '1:00-2:00,5:00-7:00' },
    {
      input: 'Tu-Su 11:00-15:00, 18:00-23:00',
      output: 'Tu-Su 11:00-15:00,18:00-23:00',
    },
  ])('$input', ({ input, output }) => {
    expect(buildString(getDaysTable(input))).toEqual(output);
    expect(canItHandle(input)).toBe(true);
  });
});

describe('canEditorHandle() === false', () => {
  test.each([
    { input: 'Mo 08:00-12:00, Tu 13:00-17:00' },
    { input: 'Sep-Jan 08:00-12:00' },
    { input: '1:00' },
    { input: '1:00-2:0' },
    { input: 'Mo-We 1:00-2:00; Fr 1:00-2:00' }, // we cant merge days yet, TODO update sanitize ?
    { input: 'Mo' },
    { input: 'Mo,PH 08:00-12:00' },
  ])('$input', ({ input }) => {
    expect(canItHandle(input)).toBe(false);
  });
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
    { input: 'Sa,PH,Su,WhateveR', output: 'Sa-Su,ph,whatever' },
  ])('$input', ({ input, output }) => {
    const result = buildDaysPart(parseDaysPart(input));
    expect(result).toBe(output ?? input);
  });
});
