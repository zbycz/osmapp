import type { NextApiRequest, NextApiResponse } from 'next';
import { refreshClimbingTiles } from '../../../src/server/climbing-tiles/refreshClimbingTiles';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!process.env.NEXT_PUBLIC_ENABLE_CLIMBING_TILES) {
      throw new Error('NEXT_PUBLIC_ENABLE_CLIMBING_TILES must be on');
    }

    const log = await refreshClimbingTiles();

    res.status(200).send(log);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(500).send(String(err));
  }
};
