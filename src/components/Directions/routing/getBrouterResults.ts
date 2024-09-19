import { PointsTooFarError, Profile, RoutingResult } from './types';
import { LonLat } from '../../../services/types';
import { fetchJson } from '../../../services/fetch';
import { getBbox } from '../../../services/getCenter';
import { FetchError } from '../../../services/helpers';

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

  try {
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
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.data.includes('to-position not mapped in existing datafile')) {
        throw new PointsTooFarError();
      }
      throw error;
    }
  }
};

// f189b841-6529-46c6-8a91-51f17477dcda
// https://graphhopper.com/api/1/route?point=49.932707,11.588051&point=50.3404,11.64705&vehicle=car&debug=true&key=f189b841-6529-46c6-8a91-51f17477dcda&type=json&points_encoded=false
// https://graphhopper.com/api/1/route?point=49.932707,11.588051&point=50.3404,11.64705&vehicle=car&debug=true&key=f189b841-6529-46c6-8a91-51f17477dcda&type=json&calc_points=false&instructions=false
// https://graphhopper.com/api/1/route?point=49.932707,11.588051&point=50.3404,11.64705&vehicle=car&debug=true&key=f189b841-6529-46c6-8a91-51f17477dcda&optimize=true
