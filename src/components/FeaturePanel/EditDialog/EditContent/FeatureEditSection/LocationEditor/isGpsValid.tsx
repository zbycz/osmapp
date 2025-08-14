import { LonLat } from '../../../../../../services/types';

export const isGpsValid = (nodeLonLat: LonLat) => {
  if (!nodeLonLat) return false;

  const [lon, lat] = nodeLonLat;
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};
