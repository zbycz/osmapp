import type { NextApiRequest, NextApiResponse } from 'next';
import { getClimbingTile } from '../../../src/server/climbing-tiles/getClimbingTile';
import { Tile } from '../../../src/types';

const CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000'];

const addCorsHeaders = (req: NextApiRequest, res: NextApiResponse) => {
  const origin = req.headers.origin;
  if (CORS_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

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

    addCorsHeaders(req, res);
    res.status(200).send(geojson);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(err.code ?? 400).send(String(err));
  }
};
