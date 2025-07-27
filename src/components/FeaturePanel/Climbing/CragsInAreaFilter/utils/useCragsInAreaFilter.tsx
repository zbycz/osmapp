import { useMemo } from 'react';
import {
  UserSettingsType,
  useUserSettingsContext,
} from '../../../../utils/UserSettingsContext';
import { GRADE_TABLE } from '../../../../../services/tagging/climbing/gradeData';

const SETTINGS_KEY = 'climbing.filter';
type ClimbingFilter = UserSettingsType['climbing.filter'];
const DEFAULT_MINIMUM_ROUTES_IN_INTERVAL = 1;

const isSameInterval = (a: [number, number], b: [number, number]) =>
  a[0] === b[0] && a[1] === b[1];

export const useCragsInAreaFilter = () => {
  const { userSettings, setUserSetting } = useUserSettingsContext();
  const currentGradeSystem = userSettings['climbing.gradeSystem'] || 'uiaa';
  const values = GRADE_TABLE[currentGradeSystem];
  const uniqueGrades = useMemo(() => [...new Set(values)], [values]);
  const defaultGradeInterval = [0, uniqueGrades.length - 1] as [number, number];

  const filter = (userSettings[SETTINGS_KEY] ?? {}) as ClimbingFilter;
  const setFilter = (name: string, value) => {
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
