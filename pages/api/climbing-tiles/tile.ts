import type { NextApiRequest, NextApiResponse } from 'next';
import { getClimbingTile } from '../../../src/server/climbing-tiles/getClimbingTile';
import { Tile } from '../../../src/types';

const addCorsHeaders = (req: NextApiRequest, res: NextApiResponse) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  addCorsHeaders(req, res);
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

    res.status(200).setHeader('Content-Type', 'application/json').send(geojson);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
