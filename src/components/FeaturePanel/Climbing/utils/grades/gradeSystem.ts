import { GRADE_SYSTEMS } from './gradeData';

export const gradeSystemKeys = GRADE_SYSTEMS.map(
  (gradeSystem) => `climbing:grade:${gradeSystem.key}`,
);
