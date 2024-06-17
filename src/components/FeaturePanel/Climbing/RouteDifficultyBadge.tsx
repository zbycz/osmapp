import React from 'react';
import styled from 'styled-components';
import { Tooltip } from '@mui/material';
import { GradeSystem, RouteDifficulty } from './types';
import { useClimbingContext } from './contexts/ClimbingContext';
import {
  convertGrade,
  getDifficultyColor,
  getGradeSystemName,
} from './utils/routeGrade';

const Container = styled.div<{ $color: string }>`
  border-radius: 12px;
  padding: 2px 8px;
  background-color: ${({ $color }) => $color};
  display: inline-block;
  font-size: 13px;
  font-weight: 900;
  color: ${({ theme, $color }) => theme.palette.getContrastText($color)};
  font-family: monospace;
`;

type Props = {
  routeDifficulty: RouteDifficulty;
  selectedRouteSystem?: GradeSystem;
};

export const RouteDifficultyBadge = ({
  routeDifficulty,
  selectedRouteSystem,
}: Props) => {
  const { gradeTable } = useClimbingContext();

  const convertedGrade = selectedRouteSystem
    ? convertGrade(
        gradeTable,
        routeDifficulty?.gradeSystem,
        selectedRouteSystem,
        routeDifficulty?.grade,
      )
    : routeDifficulty.grade;

  const gradeValue = convertedGrade ?? routeDifficulty?.grade ?? '?';

  const gradeSystemName = getGradeSystemName(
    convertedGrade ? selectedRouteSystem : routeDifficulty?.gradeSystem,
  );

  const colorByDifficulty = getDifficultyColor(gradeTable, routeDifficulty);

  return (
    <Tooltip
      title={`${gradeValue} according to ${gradeSystemName ?? '?'}`}
      enterDelay={1500}
    >
      <Container $color={colorByDifficulty}>{gradeValue}</Container>
    </Tooltip>
  );
};
