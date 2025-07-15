import type { NextApiRequest, NextApiResponse } from 'next';
import { addCorsAndCache } from '../../../src/server/climbing-tiles/addCorsAndCache';
import { getClimbingSearch } from '../../../src/server/climbing-tiles/getClimbingSearch';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  addCorsAndCache(res);
  try {
    const { q, lon, lat } = req.query;
    if (q instanceof Array || lon instanceof Array || lat instanceof Array) {
      throw new Error('Each param must be present only once');
    }

    const json = await getClimbingSearch(q, Number(lon), Number(lat));

    res.status(200).setHeader('Content-Type', 'application/json').send(json);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(500).send(String(err));
  }
};
