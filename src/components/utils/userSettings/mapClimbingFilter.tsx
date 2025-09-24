import { GradeSystem } from '../../../services/tagging/climbing/gradeSystems';
import { isEqual } from 'lodash';
import { Interval } from './getClimbingFilter';

export const mapClimbingFilter = {
  userSystem: undefined,
  gradeInterval: undefined,
  minimumRoutes: undefined,
  isDefaultFilter: false,
  isGradeIntervalDefault: true,
  isMinimumRoutesDefault: true,
  callback: () => {},
};

export const updateMapFilter = (
  userSystem: GradeSystem,
  gradeInterval: Interval,
  minimumRoutes: number,
  isDefaultFilter: boolean,
) => {
  if (
    mapClimbingFilter.userSystem != userSystem ||
    !isEqual(mapClimbingFilter.gradeInterval, gradeInterval) ||
    mapClimbingFilter.minimumRoutes != minimumRoutes
  ) {
    mapClimbingFilter.userSystem = userSystem;
    mapClimbingFilter.gradeInterval = gradeInterval;
    mapClimbingFilter.minimumRoutes = minimumRoutes;
    mapClimbingFilter.isDefaultFilter = isDefaultFilter;
    mapClimbingFilter.callback();
  }
};
