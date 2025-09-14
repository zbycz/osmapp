import {
  UserSettingsContextType,
  UserSettingsType,
} from './UserSettingsContext';
import { GRADE_TABLE } from '../../../services/tagging/climbing/gradeData';
import { GradeSystem } from '../../../services/tagging/climbing/gradeSystems';
import { Setter } from '../../../types';
import { isEqual } from 'lodash';

export type Interval = [number, number];

export type ClimbingFilterSettings = {
  filterGradeSystem: GradeSystem;
  gradeInterval: Interval | null;
  minimumRoutes: number;
};

type SetFilter = <T extends keyof ClimbingFilterSettings>(
  name: T,
  value: ClimbingFilterSettings[T],
) => void;

const SETTINGS_KEY = 'climbing.filter';
const DEFAULT_MINIMUM_ROUTES = 1;

export const mapClimbingFilter = {
  gradeInterval: undefined,
  minimumRoutes: undefined,
  isDefaultFilter: false,
  isGradeIntervalDefault: true,
  isMinimumRoutesDefault: true,
  callback: () => {},
};
const updateMapFilter = (
  gradeInterval: Interval,
  minimumRoutes: number,
  isDefaultFilter: boolean,
) => {
  if (
    !isEqual(mapClimbingFilter.gradeInterval, gradeInterval) ||
    mapClimbingFilter.minimumRoutes != minimumRoutes
  ) {
    mapClimbingFilter.gradeInterval = gradeInterval;
    mapClimbingFilter.minimumRoutes = minimumRoutes;
    mapClimbingFilter.isDefaultFilter = isDefaultFilter;
    mapClimbingFilter.callback();
  }
};

const isSameInterval = (a: Interval, b: Interval) =>
  a[0] === b[0] && a[1] === b[1];

export type ClimbingFilter = {
  grades: string[];
  gradeInterval: Interval;
  setGradeInterval: Setter<Interval>;
  minimumRoutes: number;
  setMinimumRoutes: Setter<number>;
  isDefaultFilter: boolean;
  isGradeIntervalDefault: boolean;
  isMinimumRoutesDefault: boolean;
  reset: () => void;
};

export const getClimbingFilter = (
  userSettings: UserSettingsType,
  setUserSetting: UserSettingsContextType['setUserSetting'],
): ClimbingFilter => {
  const currentSystem = userSettings['climbing.gradeSystem'] || 'uiaa';
  const grades = GRADE_TABLE[currentSystem];
  const data = (userSettings[SETTINGS_KEY] ?? {}) as ClimbingFilterSettings;

  const setFilter: SetFilter = (name, value) => {
    setUserSetting(SETTINGS_KEY, { ...data, [name]: value });
  };

  const defaultGradeInterval = [0, grades.length - 1] as Interval;
  const gradeInterval = data?.gradeInterval ?? defaultGradeInterval;
  const setGradeInterval = (interval: Interval) =>
    setFilter('gradeInterval', interval);

  const minimumRoutes = data?.minimumRoutes ?? DEFAULT_MINIMUM_ROUTES;
  const setMinimumRoutes = (num: number) => setFilter('minimumRoutes', num);

  const isGradeIntervalDefault = isSameInterval(
    gradeInterval,
    defaultGradeInterval,
  );
  const isMinimumRoutesDefault = minimumRoutes === DEFAULT_MINIMUM_ROUTES;

  const isDefaultFilter = isGradeIntervalDefault && isMinimumRoutesDefault;

  updateMapFilter(gradeInterval, minimumRoutes, isDefaultFilter);

  return {
    grades,
    gradeInterval,
    setGradeInterval,
    minimumRoutes,
    setMinimumRoutes,
    isDefaultFilter,
    isGradeIntervalDefault,
    isMinimumRoutesDefault,
    reset: () => setUserSetting(SETTINGS_KEY, {} as ClimbingFilterSettings),
  };
};
