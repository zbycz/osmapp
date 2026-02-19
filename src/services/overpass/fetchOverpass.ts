import { fetchJson } from '../fetch';
import { FetchError } from '../helpers';

// TODO add proper overpass types from refreshClimbingTilesHelpers.ts

const OVERPASS_HOSTS = [
  'overpass.private.coffee', // alternative instance (minutely synced), we prefer it for bigger HW & less known
  'overpass-api.de', // main instance (minutely synced)
  'maps.mail.ru/osm/tools/overpass', // last alternative (minutely synced)
];

// Overpass lately experiences a lot of wierd issues ~ February 2026, see https://community.openstreetmap.org/t/overpass-api-performance-issues/140598
const isRetryableError = (e: FetchError) => {
  return (
    (e instanceof Error && e.message.includes('fetchJson: parse error')) ||
    (e instanceof FetchError &&
      (e.code === '429' ||
        e.code === '500' ||
        e.code === '502' ||
        e.code === '503' ||
        e.code === '504'))
  );
};

export const fetchOverpass = async (query: string) => {
  const LAST_INDEX = OVERPASS_HOSTS.length - 1;

  for (let i = 0; i < OVERPASS_HOSTS.length; i++) {
    const host = OVERPASS_HOSTS[i];

    try {
      const url = `https://${host}/api/interpreter?data=${encodeURIComponent(query)}`;
      const response = await fetchJson(url);

      return response;
    } catch (e) {
      if (i === LAST_INDEX) {
        throw e;
      }

      if (isRetryableError(e)) {
        console.info(`Overpass ${host} failed, will try next host.`, e); // eslint-disable-line no-console
        continue;
      }

      throw e;
    }
  }
};
