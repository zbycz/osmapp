import { LonLat } from '../../../services/types';
import { Option } from '../types';
import { getRoundedPosition, roundedToDeg } from '../../../utils';
import { getGlobalMap } from '../../../services/mapStorage';

export const getCoordsOption = (center: LonLat, label?: string): Option => ({
  type: 'coords',
  coords: {
    center,
    label:
      label ||
      roundedToDeg(getRoundedPosition(center, getGlobalMap().getZoom())),
  },
});
