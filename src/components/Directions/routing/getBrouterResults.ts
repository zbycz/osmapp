import { Profile, RoutingResult } from './types';
import { LonLat } from '../../../services/types';
import { fetchJson } from '../../../services/fetch';
import { getBbox } from '../../../services/getCenter';

export const brouterProfiles: Record<Profile, string> = {
  car: 'car-fast',
  bike: 'trekking',
  walk: 'hiking-mountain',
};

export const getBrouterResults = async (
  mode: Profile,
  points: LonLat[],
): Promise<RoutingResult> => {
  const profile = brouterProfiles[mode];
  const from = points[0].join(',');
  const to = points[1].join(',');
  const url = `https://brouter.de/brouter?lonlats=${from}|${to}&profile=${profile}&alternativeidx=0&format=geojson`;
  const geojson = await fetchJson(url);

  return {
    time: geojson.features[0].properties['total-time'],
    distance: geojson.features[0].properties['track-length'],
    totalAscent: geojson.features[0].properties['filtered ascend'],
    router: geojson.features[0].properties.creator,
    link: 'https://www.brouter.de/brouter-web/',
    bbox: getBbox(geojson.features[0].geometry.coordinates),
    geojson,
  };
};
