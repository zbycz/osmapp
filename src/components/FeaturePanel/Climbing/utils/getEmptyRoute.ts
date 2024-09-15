import { ClimbingRoute } from '../types';
import { getPoiClass } from '../../../../services/getPoiClass';

let counter = -1;

export const getEmptyRoute = (): ClimbingRoute => {
  counter -= 1;

  const tags = { climbing: 'route_bottom', sport: 'climbing' };
  return {
    id: '',
    difficulty: { grade: '', gradeSystem: 'uiaa' },
    paths: {},
    updatedTags: { ...tags },
    feature: {
      type: 'Feature',
      osmMeta: { type: 'node', id: counter },
      tags,
      properties: { ...getPoiClass(tags) },
      center: [], // TODO
    },
  };
};
