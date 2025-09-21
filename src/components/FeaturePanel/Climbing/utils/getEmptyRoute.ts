import { ClimbingRoute } from '../types';
import { getPoiClass } from '../../../../services/getPoiClass';

import { DEFAULT_GRADE_SYSTEM } from '../../../../services/tagging/climbing/gradeSystems';

let counter = -1;

export const getEmptyRoute = (): ClimbingRoute => {
  counter -= 1;

  const tags = { climbing: 'route_bottom', sport: 'climbing' };
  return {
    id: '',
    difficulty: { grade: '', gradeSystem: DEFAULT_GRADE_SYSTEM },
    paths: {},
    updatedTags: { ...tags },
    feature: {
      type: 'Feature',
      osmMeta: { type: 'node', id: counter },
      tags,
      properties: { ...getPoiClass(tags) },
      center: [0, 0], // TODO
    },
  };
};
