import type { NextApiRequest, NextApiResponse } from 'next';
import { getClimbingTile } from '../../../src/server/climbing-tiles/getClimbingTile';
import { addCorsHeaders } from '../../../src/server/climbing-tiles/utils';
import { Tile } from '../../../src/types';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  addCorsHeaders(req, res);
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
    res.status(err.code ?? 400).send(String(err));
  }
};
