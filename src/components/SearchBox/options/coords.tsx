import { LonLat } from '../../../services/types';
import { Option } from '../types';

export const getCoordsOption = (center: LonLat, label?: string): Option => ({
  type: 'coords',
  coords: {
    center,
    label: label || center.toReversed().join(','),
  },
});
