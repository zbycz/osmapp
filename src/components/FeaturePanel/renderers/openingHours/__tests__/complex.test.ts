import { parseComplexOpeningHours } from '../complex';
import { intl } from '../../../../../services/intl';
import { SimpleOpeningHoursTable } from '../types';

const PRAGUE = [14.4208, 50.088] as [number, number];
const ADDRESS = { country_code: 'cz', state: '' };

const setUp = (lang: string, isImperial = false) => {
  intl.lang = lang;
  window.localStorage.setItem('userSettings', JSON.stringify({ isImperial }));
};

const daysTable = (value: string): SimpleOpeningHoursTable =>
  parseComplexOpeningHours(value, PRAGUE, ADDRESS).daysTable;

describe('parseComplexOpeningHours', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-05-01T10:00:00Z')); // Wednesday
    setUp('en');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders midnight at the end of an interval as 24:00', () => {
    expect(daysTable('Mo-Su 09:00-00:00').mo).toEqual(['09:00-24:00']);
    expect(daysTable('Mo-Su 09:00-24:00').mo).toEqual(['09:00-24:00']);
  });

  it('keeps midnight at the beginning of an interval as 00:00', () => {
    expect(daysTable('Mo-Su 00:00-06:00').mo).toEqual(['00:00-06:00']);
    expect(daysTable('Mo-Su 00:00-01:00,19:00-24:00').fr).toEqual([
      '19:00-01:00',
    ]);
  });

  it('renders the whole day as a single translation', () => {
    expect(daysTable('24/7').mo).toEqual(['opening_hours.all_day']);
    expect(daysTable('Mo-Su 00:00-24:00').mo).toEqual([
      'opening_hours.all_day',
    ]);
  });

  it('does not touch times which are close to midnight', () => {
    expect(daysTable('Mo-Su 11:00-24:30').mo).toEqual(['11:00-00:30']);
    expect(daysTable('Mo-Su 11:00-23:59').mo).toEqual(['11:00-23:59']);
  });

  it('uses the local time format', () => {
    setUp('cs');
    expect(daysTable('Mo-Su 09:00-00:00').mo).toEqual(['9:00-24:00']);

    setUp('en', true);
    expect(daysTable('Mo-Su 09:00-00:00').mo).toEqual(['9:00 AM-12:00 AM']);
  });
});
