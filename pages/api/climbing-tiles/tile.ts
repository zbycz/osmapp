import type { NextApiRequest, NextApiResponse } from 'next';
import { getClimbingTile } from '../../../src/server/climbing-tiles/getClimbingTile';
import { Tile } from '../../../src/types';
import { addCorsAndCache } from '../../../src/server/climbing-tiles/addCorsAndCache';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  addCorsAndCache(res);
  try {
    const tileNumber: Tile = {
      z: Number(req.query.z),
      x: Number(req.query.x),
      y: Number(req.query.y),
    };

    const geojson = await getClimbingTile(tileNumber);

    res.status(200).setHeader('Content-Type', 'application/json').send(geojson);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(500).send(String(err));
  }
};
