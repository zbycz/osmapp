import type { NextApiRequest, NextApiResponse } from 'next';
import { climbingTile, refresh } from '../../../src/server/climbing-tiles/algo';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const json = await refresh();

    res.status(200).json(json);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
