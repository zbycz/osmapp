import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';

interface OsmAuthFetchOpts extends RequestInit {
  osmAccessToken: string;
}

export const osmAuthFetch = async <T = any>(
  endpoint: string,
  options: OsmAuthFetchOpts,
): Promise<T> => {
  if (!options.osmAccessToken) throw new Error('No access token');

  const url = `https://api.openstreetmap.org${endpoint}`;
  const headers = {
    'User-Agent': 'osmapp (SSR; https://osmapp.org/)',
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Bearer ${options.osmAccessToken}`,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok || response.status < 200 || response.status >= 300) {
    const data = await response.text();
    const suffix = data && ` Data: ${data.substring(0, 1000)}`;
    throw new Error(`${response.status} ${response.statusText}${suffix}`);
  }

  return response.json();
};

export const fetchOsmUsername = async (
  options: OsmAuthFetchOpts,
): Promise<string> => {
  const { user } = await osmAuthFetch('/api/0.6/user/details.json', options);
  return user.display_name;
};



// TODO upgrade Nextjs and use export async function POST(request: NextRequest) {
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { osmAccessToken } = req.cookies;
    const osmUser = await fetchOsmUsername({ osmAccessToken });

    res.status(200).json({ body: req.body, osmUser, osmAccessToken });

  } catch (err) {
    console.error(err);
    res.status(400).send(String(err));
  }
};
