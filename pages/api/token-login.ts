import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';

interface OsmAuthFetchOpts extends RequestInit {
  accessToken: string;
}

const osmAuthFetch = async <T = any>(
  endpoint: string,
  options: OsmAuthFetchOpts,
): Promise<T> => {
  const url = `https://api.openstreetmap.org${endpoint}`;
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Bearer ${options.accessToken}`,
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


const year = 60 * 60 * 24 * 365;

// TODO upgrade Nextjs and use export async function POST(request: NextRequest) {
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' });
      return;
    }

    const accessToken = req.body.accessToken;
    if (!accessToken) {
      res.status(400).send({ message: 'accessToken mising' });
      return;
    }

    const osmUser = await fetchOsmUsername({ accessToken });

    res.setHeader(
      'Set-Cookie',
      `accessToken=${accessToken}; Path=/; Max-Age=${year}; SameSite=Strict; Secure; HttpOnly`,
    );
    res.status(200).json({ body: req.body, osmUser, accessToken });

  } catch (err) {
    console.error(err);
    res.status(400).send(String(err));
  }
};
