import React from 'react';
import styled from 'styled-components';
import { Tooltip, useTheme } from '@mui/material';
import {
  convertGrade,
  getDifficulty,
  getDifficultyColor,
  getGradeSystemName,
} from './utils/grades/routeGrade';
import { GradeSystem } from './utils/grades/gradeData';
import { Feature } from '../../../services/types';

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
  routeFeature: Feature;
  selectedRouteSystem?: GradeSystem;
};

export const RouteDifficultyBadge = ({
  routeFeature,
  selectedRouteSystem,
}: Props) => {
  const theme = useTheme();
  const routeDifficulty = getDifficulty(routeFeature?.tags);

  const convertedGrade = selectedRouteSystem
    ? convertGrade(
        routeDifficulty?.gradeSystem,
        selectedRouteSystem,
        routeDifficulty?.grade,
      )
    : routeDifficulty.grade;

  const gradeValue = convertedGrade ?? routeDifficulty?.grade ?? '?';

  const gradeSystemName = getGradeSystemName(
    convertedGrade ? selectedRouteSystem : routeDifficulty?.gradeSystem,
  );

  const colorByDifficulty = getDifficultyColor(routeFeature?.tags, theme);

  return (
    <Tooltip
      title={`${gradeValue} according to ${gradeSystemName ?? '?'}`}
      enterDelay={1500}
    >
      <Container $color={colorByDifficulty}>{gradeValue}</Container>
    </Tooltip>
  );
};
