import type { NextApiResponse } from 'next';

const REFRESH_TIME = 3; // taken from vercel.json cron schedule

export const getHoursUntilNextRefresh = () => {
  const currentTimeUtc = new Date().getUTCHours() + 1; // 1-24 (we ceil 2:29 up to 3)
  return (REFRESH_TIME - currentTimeUtc + 24) % 24;
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
