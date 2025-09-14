import type { NextApiRequest, NextApiResponse } from 'next';
import { refreshClimbingTiles } from '../../../src/server/climbing-tiles/refreshClimbingTiles';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const log = await refreshClimbingTiles();

    res.status(200).send(log);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(500).send(String(err));
  }
};
