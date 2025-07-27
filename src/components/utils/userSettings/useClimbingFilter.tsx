import { useMemo } from 'react';
import { UserSettingsType } from './UserSettingsContext';
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
  uniqueGrades: string[];
  gradeInterval: [number, number];
  setGradeInterval: (gradeInterval: [number, number]) => void;
  minimumRoutesInInterval: number;
  setMinimumRoutesInInterval: (minimumRoutesInInterval: number) => void;
  isDefaultFilter: boolean;
};

export const useClimbingFilter = (
  userSettings: UserSettingsType,
  setUserSetting: (key: string, value: Object) => void,
): ClimbingFilter => {
  const currentGradeSystem = userSettings['climbing.gradeSystem'] || 'uiaa';
  const values = GRADE_TABLE[currentGradeSystem];
  const uniqueGrades = useMemo(() => [...new Set(values)], [values]);
  const defaultGradeInterval = [0, uniqueGrades.length - 1] as [number, number];

  const filter = (userSettings[SETTINGS_KEY] ?? {}) as ClimbingFilterSettings;

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
    uniqueGrades,
    gradeInterval,
    setGradeInterval,
    minimumRoutesInInterval,
    setMinimumRoutesInInterval,
    isDefaultFilter,
  };
};
