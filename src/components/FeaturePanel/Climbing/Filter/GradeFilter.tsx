import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';
import { Slider, Stack } from '@mui/material';
import { t } from '../../../../services/intl';
import { GradeSystemSelect } from '../GradeSystemSelect';
import { RouteDifficultyBadge } from '../RouteDifficultyBadge';
import React from 'react';
import { Interval } from '../../../utils/userSettings/getClimbingFilter';
import styled from '@emotion/styled';
import { useGetSliderColors } from '../../../../services/tagging/climbing/gradeData';

const convertToUnique = ([minIndex, maxIndex]: Interval, grades: string[]) => {
  const uniqueGrades = [...new Set(grades)];
  const value: Interval = [
    uniqueGrades.indexOf(grades[minIndex]),
    uniqueGrades.indexOf(grades[maxIndex]),
  ];
  return { value, max: uniqueGrades.length - 1 };
};

const convertFromUnique = (
  [minIndex, maxIndex]: Interval,
  grades: string[],
): Interval => {
  const uniqueGrades = [...new Set(grades)];
  return [
    grades.indexOf(uniqueGrades[minIndex]),
    grades.indexOf(uniqueGrades[maxIndex]),
  ];
};

const StyledSlider = styled(Slider, {
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $colors: string }>`
  .MuiSlider-rail {
    background-image:${({ $colors }) => $colors});
    opacity: 1;
    height: 6px;
  }
  .MuiSlider-track {
    background: none;
    border: 0;
  }
`;

const GradesFilterSlider = () => {
  const { climbingFilter } = useUserSettingsContext();
  const { gradeInterval, setGradeInterval, grades } = climbingFilter;
  const { value, max } = convertToUnique(gradeInterval, grades);

  const onChange = (_: Event, newValue: Interval) => {
    setGradeInterval(convertFromUnique(newValue, grades));
  };
  return (
    <StyledSlider
      value={value}
      onChange={onChange}
      min={0}
      max={max}
      $colors={useGetSliderColors(grades)}
    />
  );
};

export const GradeFilter = () => {
  const { gradeSystem, climbingFilter } = useUserSettingsContext();
  const { gradeInterval, grades } = climbingFilter;

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
        <GradeSystemSelect showDefaultOnButton />
      </Stack>
      <Stack gap={1} ml={2} mr={2} mb={2}>
        <div>
          {t('crag_filter.grade_from')}{' '}
          <RouteDifficultyBadge
            routeDifficulty={{
              gradeSystem,
              grade: grades[gradeInterval[0]],
            }}
          />{' '}
          {grades[gradeInterval[1]] && (
            <>
              {t('crag_filter.grade_to')}{' '}
              <RouteDifficultyBadge
                routeDifficulty={{
                  gradeSystem,
                  grade: grades[gradeInterval[1]],
                }}
              />
            </>
          )}
        </div>
        <GradesFilterSlider />
      </Stack>
    </>
  );
};
