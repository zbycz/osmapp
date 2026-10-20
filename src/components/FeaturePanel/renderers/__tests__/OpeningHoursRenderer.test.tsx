import React from 'react';
import { render } from '@testing-library/react';
import { FeatureContext } from '../../../utils/FeatureContext';
import { intl } from '../../../../services/intl';
import vocabulary from '../../../../locales/vocabulary';
import { OpeningHoursRenderer } from '../OpeningHoursRenderer';

const feature = {
  countryCode: 'cz',
  center: [14.4208, 50.088],
};

const renderValue = (v: string) =>
  render(
    <FeatureContext.Provider value={{ feature } as any}>
      <OpeningHoursRenderer v={v} />
    </FeatureContext.Provider>,
  );

const MAYBE_VALUE = 'Tu-Sa 11:00-17:00 "Bookings by email only"';

describe('OpeningHoursRenderer', () => {
  beforeEach(() => {
    intl.lang = 'en';
    intl.messages = vocabulary;
    window.localStorage.setItem('userSettings', JSON.stringify({}));
    jest.useFakeTimers().setSystemTime(new Date('2024-05-01T10:00:00Z')); // Wednesday
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows "Maybe open" with the reason while inside an unknown interval', () => {
    jest.setSystemTime(new Date('2024-05-01T12:00:00Z')); // Wednesday, inside

    const { container } = renderValue(MAYBE_VALUE);

    expect(container.textContent).toBe(
      'Maybe open: 11-17(Bookings by email only)',
    );
  });

  it('shows "Closed now - Maybe open" with the reason outside an unknown interval', () => {
    const { container } = renderValue(MAYBE_VALUE); // Wednesday, before 11:00

    expect(container.textContent).toBe(
      'Closed now - Maybe open: 11-17(Bookings by email only)',
    );
  });

  it('keeps the classic "Closed now - Opens" wording for known intervals', () => {
    const { container } = renderValue('We 11:00-17:00');

    expect(container.textContent).toBe('Closed now - Opens: 11-17');
  });

  it('escapes a malicious reason so OSM data cannot inject markup', () => {
    const malicious = 'Tu-Sa 11:00-17:00 "<img src=x onerror=alert(1)>"';

    const { container } = renderValue(malicious); // Wednesday, before 11:00

    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).toBe(
      'Closed now - Maybe open: 11-17(<img src=x onerror=alert(1)>)',
    );
    expect(container.innerHTML).toContain('&lt;img src=x onerror=alert(1)&gt;');
  });
});
