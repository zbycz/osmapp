import type { NextApiResponse } from 'next';
import vercelJson from '../../../vercel.json';

const REFRESH_TIME = Number(vercelJson.crons[0].schedule.split(' ')[1]);

export const getHoursUntilNextRefresh = () => {
  const currentTimeUtc = new Date().getUTCHours() + 1; // 1-24 (we ceil 2:29 up to 3)
  const hoursUntilNextRefresh = (REFRESH_TIME - currentTimeUtc + 24) % 24;
  return hoursUntilNextRefresh;
};

const getSwrAge = () => {
  const hoursUntilNextRefresh = getHoursUntilNextRefresh();

  return hoursUntilNextRefresh > 1
    ? `, stale-while-revalidate=${hoursUntilNextRefresh * 3600}`
    : '';
};

export const addCorsAndCache = (res: NextApiResponse) => {
  const maxAge = 'max-age=3600, s-maxage=3600'; // update also in `climbing_tiles.stats` message
  const swrAge = getSwrAge();

  res.setHeader('Access-Control-Allow-Origin', '*'); // wildcard is needed to enable the vercel cache, it ignores the `origin` and caches randomnly one TODO consider Vary header if need be
  res.setHeader('Cache-Control', `public, ${maxAge}${swrAge}`);
};
