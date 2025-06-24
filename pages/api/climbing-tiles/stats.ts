import type { NextApiRequest, NextApiResponse } from 'next';
import { getClimbingStats } from '../../../src/server/climbing-tiles/getClimbingStats';
import { addCorsAndCache } from '../../../src/server/climbing-tiles/addCorsAndCache';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  addCorsAndCache(res);
  try {
    const json = await getClimbingStats();

    res.status(200).setHeader('Content-Type', 'application/json').send(json);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(500).send(String(err));
  }
};
