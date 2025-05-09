import { Feature } from '../types';
import { resolveCountryCode } from 'next-codegrid';
import * as Sentry from '@sentry/nextjs';

export const getCountryCode = async (
  feature: Feature,
): Promise<string | null> => {
  try {
    return await resolveCountryCode(feature.center); // takes 0-100ms for first resolution, then instant
  } catch (e) {
    console.warn('countryCode left empty – resolveCountryCode():', e); // eslint-disable-line no-console
    Sentry.captureException(e, { extra: { feature } });
  }
  return null;
};
