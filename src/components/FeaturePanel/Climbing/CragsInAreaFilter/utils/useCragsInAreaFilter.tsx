import React, { useMemo } from 'react';
import { useUserSettingsContext } from '../../../../utils/UserSettingsContext';
import { GRADE_TABLE } from '../../../../../services/tagging/climbing/gradeData';
import { number } from 'prop-types';

const userSettingsClimbingFilterKey = 'climbing.filter';

export const useCragsInAreaFilter = () => {
  const { userSettings, setUserSetting } = useUserSettingsContext();
  const currentGradeSystem = userSettings['climbing.gradeSystem'] || 'uiaa';

  const filter = userSettings[userSettingsClimbingFilterKey];
  const values = GRADE_TABLE[currentGradeSystem];
  const uniqueValues = useMemo(() => [...new Set(values)], [values]);

  const setFilter = (name, value) => {
    setUserSetting(userSettingsClimbingFilterKey, {
      ...filter,
      [name]: value,
    });
  };

  return {
    uniqueValues,
    gradeInterval: filter?.gradeInterval ?? null,
    setGradeInterval: (gradeInterval: number[]) =>
      setFilter('gradeInterval', gradeInterval),
    minimumRoutesInInterval: filter?.minimumRoutesInInterval ?? 1,
    setMinimumRoutesInInterval: (minimumRoutesInInterval: number) =>
      setFilter('minimumRoutesInInterval', minimumRoutesInInterval),
    isTouched: filter?.isTouched ?? false,
    setIsTouched: (isTouched: boolean) => setFilter('isTouched', isTouched),
  };
};
