import type { NextApiRequest, NextApiResponse } from 'next';
import { addCorsHeaders } from '../../../src/server/climbing-tiles/utils';
import { getClimbingStats } from '../../../src/server/climbing-tiles/getClimbingStats';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  addCorsHeaders(req, res);
  try {
    const json = await getClimbingStats();

    res.setHeader(
      'Cache-Control',
      'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    );

    res.status(200).setHeader('Content-Type', 'application/json').send(json);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(500).send(String(err));
  }
};
