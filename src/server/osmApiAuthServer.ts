import fetch from 'isomorphic-unfetch';
import { FetchError } from '../services/helpers';

interface OsmAuthFetchOpts extends RequestInit {
  osmAccessToken: string;
}

const osmAuthFetch = async <T = any>(
  endpoint: string,
  options: OsmAuthFetchOpts,
): Promise<T> => {
  const { osmAccessToken, ...restOptions } = options;
  if (!osmAccessToken) throw new FetchError('No access token', '401');

  const url = `https://api.openstreetmap.org${endpoint}`;
  const headers = {
    'User-Agent': 'osmapp (SSR; https://osmapp.org/)',
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Bearer ${osmAccessToken}`,
  };

  const response = await fetch(url, {
    ...restOptions,
    headers,
  });

  if (!response.ok || response.status < 200 || response.status >= 300) {
    const data = await response.text();
    throw new FetchError(
      `${response.status} ${response.statusText}`,
      `${response.status}`,
      data,
    );
  }

  return response.json();
};

export type ServerOsmUser = { id: number; username: string };

export const serverFetchOsmUser = async (req): Promise<ServerOsmUser> => {
  const { osmAccessToken } = req.cookies;
  const options = { osmAccessToken };
  const { user } = await osmAuthFetch('/api/0.6/user/details.json', options);
  return {
    id: user.id,
    username: user.display_name,
  };
};
