import { ClimbingRoute } from '../types';

export const emptyRoute: ClimbingRoute = {
  id: '',
  name: '',
  author: '',
  difficulty: { grade: '', gradeSystem: 'uiaa' },
  length: '',
  paths: {},
  description: '',
};
