import { ClimbingRoute } from '../types';

export const emptyRoute: ClimbingRoute = {
  id: '',
  name: '',
  difficulty: { grade: '', gradeSystem: 'uiaa' },
  length: '',
  paths: {},
  description: '',
};
