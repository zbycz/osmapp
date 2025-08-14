import { Profile, RoutingResult } from './types';
import { LonLat } from '../../../services/types';
import { fetchJson } from '../../../services/fetch';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY_GRAPHHOPPER;

export const profiles: Record<Profile, string> = {
  car: 'car',
  bike: 'bike',
  walk: 'foot',
};

export const getGraphhopperResults = async (
  mode: Profile,
  points: LonLat[],
): Promise<RoutingResult> => {
  const profile = profiles[mode];
  const graphhopperPoints = points.map((point) => point.toReversed().join(','));
  const urlPoints = graphhopperPoints
    .map((point) => `point=${point}&`)
    .join('');

  const url = `https://graphhopper.com/api/1/route?${urlPoints}vehicle=${profile}&key=${API_KEY}&type=json&points_encoded=false&snap_prevention=ferry`;

  const data = await fetchJson(url);

  const [w, n, e, s] = data.paths[0].bbox; // "bbox":[11.588883,49.926107,11.812509,50.35675]

  return {
    time: data.paths[0].time / 1000,
    distance: data.paths[0].distance,
    totalAscent: data.paths[0].ascend,
    router: 'GraphHopper',
    link: 'https://graphhopper.com/',
    bbox: { w, s, e, n },
    geojson: data.paths[0].points,
    instructions: data.paths[0].instructions,
  };
};
