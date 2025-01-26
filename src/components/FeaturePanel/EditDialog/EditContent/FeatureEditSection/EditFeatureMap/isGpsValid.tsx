import { LonLat } from '../../../../../../services/types';

export const isGpsValid = (nodeLonLat: LonLat) => {
  if (!nodeLonLat) return false;

  const [lng, lat] = nodeLonLat;
  return lng >= -90 && lng <= 90 && lat >= -180 && lat <= 180;
};
