import type { NextApiRequest, NextApiResponse } from 'next';
import { getClimbingTile } from '../../../src/server/climbing-tiles/getClimbingTile';
import { Tile } from '../../../src/types';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!process.env.XATA_PASSWORD) {
      throw new Error('XATA_PASSWORD must be set');
    }

    const tileNumber: Tile = {
      z: Number(req.query.z),
      x: Number(req.query.x),
      y: Number(req.query.y),
    };

    const geojson = await getClimbingTile(tileNumber);

    res.setHeader('Content-Type', 'application/json').status(200).send(geojson); // TODO http cache headers
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
