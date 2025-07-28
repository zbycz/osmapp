import { useMemo } from 'react';
import {
  UserSettingsContextType,
  UserSettingsType,
} from './UserSettingsContext';
import { GRADE_TABLE } from '../../../services/tagging/climbing/gradeData';
import { GradeSystem } from '../../../services/tagging/climbing/gradeSystems';

export type ClimbingFilterSettings = {
  filterGradeSystem: GradeSystem;
  gradeInterval: [number, number] | null;
  minimumRoutesInInterval: number;
};

const SETTINGS_KEY = 'climbing.filter';
const DEFAULT_MINIMUM_ROUTES_IN_INTERVAL = 1;

const isSameInterval = (a: [number, number], b: [number, number]) =>
  a[0] === b[0] && a[1] === b[1];

export type ClimbingFilter = {
  grades: string[];
  gradeInterval: [number, number];
  setGradeInterval: (gradeInterval: [number, number]) => void;
  minimumRoutesInInterval: number;
  setMinimumRoutesInInterval: (minimumRoutesInInterval: number) => void;
  isDefaultFilter: boolean;
};

export const useClimbingFilter = (
  userSettings: UserSettingsType,
  setUserSetting: UserSettingsContextType['setUserSetting'],
): ClimbingFilter => {
  const currentSystem = userSettings['climbing.gradeSystem'] || 'uiaa';
  const filter = (userSettings[SETTINGS_KEY] ?? {}) as ClimbingFilterSettings;

  const grades = GRADE_TABLE[currentSystem];
  const defaultGradeInterval = [0, grades.length - 1] as [number, number];

  const setFilter = <T extends keyof ClimbingFilterSettings>(
    name: T,
    value: ClimbingFilterSettings[T],
  ) => {
    setUserSetting(SETTINGS_KEY, {
      ...filter,
      [name]: value,
    });
  };

  const gradeInterval = filter?.gradeInterval ?? defaultGradeInterval;
  const setGradeInterval = (gradeInterval: [number, number]) =>
    setFilter('gradeInterval', gradeInterval);

  const minimumRoutesInInterval =
    filter?.minimumRoutesInInterval ?? DEFAULT_MINIMUM_ROUTES_IN_INTERVAL;
  const setMinimumRoutesInInterval = (minimumRoutesInInterval: number) =>
    setFilter('minimumRoutesInInterval', minimumRoutesInInterval);

  const isDefaultFilter =
    minimumRoutesInInterval === DEFAULT_MINIMUM_ROUTES_IN_INTERVAL &&
    isSameInterval(gradeInterval, defaultGradeInterval);

  return {
    grades,
    gradeInterval,
    setGradeInterval,
    minimumRoutesInInterval: minimumRoutesInInterval,
    setMinimumRoutesInInterval,
    isDefaultFilter,
  };
};
