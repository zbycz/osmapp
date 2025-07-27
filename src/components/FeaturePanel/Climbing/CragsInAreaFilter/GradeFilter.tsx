import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';
import { Slider, Stack } from '@mui/material';
import { t } from '../../../../services/intl';
import { GradeSystemSelect } from '../GradeSystemSelect';
import { RouteDifficultyBadge } from '../RouteDifficultyBadge';
import React from 'react';

const convertToUnique = (gradeInterval: [number, number], grades: string[]) => {
  const uniqueGrades = [...new Set(grades)];
  const gradeIntervalInUnique = [
    uniqueGrades.indexOf(grades[gradeInterval[0]]),
    uniqueGrades.indexOf(grades[gradeInterval[1]]),
  ] as [number, number];

  return { gradeIntervalInUnique, uniqueGrades };
};

const convertFromUnique = (
  gradeIntervalInUnique: [number, number],
  grades: string[],
) => {
  const uniqueGrades = [...new Set(grades)];

  const gradeToOriginalIndex: Record<string, number> = {};
  grades.forEach((grade, i) => {
    if (!(grade in gradeToOriginalIndex)) {
      gradeToOriginalIndex[grade] = i;
    }
  });

  return [
    gradeToOriginalIndex[uniqueGrades[gradeIntervalInUnique[0]]],
    gradeToOriginalIndex[uniqueGrades[gradeIntervalInUnique[1]]],
  ] as [number, number];
};

export const GradeFilter = () => {
  const { userSettings, setUserSetting, climbingFilter } =
    useUserSettingsContext();
  const currentGradeSystem = userSettings['climbing.gradeSystem'] || 'uiaa';
  const { gradeInterval, grades } = climbingFilter;

  const { gradeIntervalInUnique, uniqueGrades } = convertToUnique(
    gradeInterval,
    grades,
  );

  const onChange = (_event: Event, newIntervalInUnique: [number, number]) => {
    climbingFilter.setGradeInterval(
      convertFromUnique(newIntervalInUnique, grades),
    );
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
        mr={2}
        ml={2}
        mt={1}
      >
        {t('crag_filter.grade')}
        <GradeSystemSelect
          setGradeSystem={(system) => {
            setUserSetting('climbing.gradeSystem', system);
          }}
          selectedGradeSystem={userSettings['climbing.gradeSystem']}
        />
      </Stack>
      <Stack gap={1} ml={2} mr={2} mb={2}>
        <div>
          {t('crag_filter.grade_from')}{' '}
          <RouteDifficultyBadge
            routeDifficulty={{
              gradeSystem: currentGradeSystem,
              grade: grades[gradeInterval[0]],
            }}
          />{' '}
          {grades[gradeInterval[1]] && (
            <>
              {t('crag_filter.grade_to')}{' '}
              <RouteDifficultyBadge
                routeDifficulty={{
                  gradeSystem: currentGradeSystem,
                  grade: grades[gradeInterval[1]],
                }}
              />
            </>
          )}
        </div>
        <Slider
          value={gradeIntervalInUnique}
          onChange={onChange}
          min={0}
          max={uniqueGrades.length - 1}
        />
      </Stack>
    </>
  );
};
