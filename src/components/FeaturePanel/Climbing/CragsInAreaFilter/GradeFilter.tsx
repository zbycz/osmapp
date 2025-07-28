import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';
import { Slider, Stack } from '@mui/material';
import { t } from '../../../../services/intl';
import { GradeSystemSelect } from '../GradeSystemSelect';
import { RouteDifficultyBadge } from '../RouteDifficultyBadge';
import React from 'react';
import { Interval } from '../../../utils/userSettings/getClimbingFilter';
import styled from '@emotion/styled';
import {
  GRADE_TABLE,
  gradeColors,
} from '../../../../services/tagging/climbing/gradeData';

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

const max = GRADE_TABLE.uiaa.length;
const p6 = Math.round((GRADE_TABLE.uiaa.indexOf('6-') / max) * 100);
const p8 = Math.round((GRADE_TABLE.uiaa.indexOf('8-') / max) * 100);
const p10 = Math.round((GRADE_TABLE.uiaa.indexOf('10-') / max) * 100);

const StyledSlider = styled(Slider)`
  .MuiSlider-rail {
    background-image: linear-gradient(
      90deg,
      ${gradeColors['1-'].light} ${p6}%,
      ${gradeColors['6-'].light} ${p6}%,
      ${gradeColors['6-'].light} ${p8}%,
      ${gradeColors['8-'].light} ${p8}%,
      ${gradeColors['8-'].light} ${p10}%,
      ${gradeColors['10-'].light} ${p10}%
    );
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
      // thumb={<span className="custom-thumb"></span>}
    />
  );
};

export const GradeFilter = () => {
  const { userSettings, climbingFilter } = useUserSettingsContext();
  const currentGradeSystem = userSettings['climbing.gradeSystem'] || 'uiaa';
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
        <GradeSystemSelect />
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
        <GradesFilterSlider />
      </Stack>
    </>
  );
};
