import React, { useMemo } from 'react';
import { useUserSettingsContext } from '../../../../utils/UserSettingsContext';
import { GRADE_TABLE } from '../../utils/grades/gradeData';

export const useCragsInAreaFilter = () => {
  const [gradeInterval, setGradeInterval] = React.useState<number[] | null>(
    null,
  );
  const [minimumRoutesInInterval, setMinimumRoutesInInterval] =
    React.useState<number>(1);
  const [isTouched, setIsTouched] = React.useState<boolean>(false);
  const { userSettings } = useUserSettingsContext();
  const currentGradeSystem = userSettings['climbing.gradeSystem'] || 'uiaa';
  const values = GRADE_TABLE[currentGradeSystem];
  const uniqueValues = useMemo(() => [...new Set(values)], [values]);

  return {
    uniqueValues,
    gradeInterval,
    setGradeInterval,
    minimumRoutesInInterval,
    setMinimumRoutesInInterval,
    setIsTouched,
    isTouched,
  };
};
