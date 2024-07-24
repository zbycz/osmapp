import React from 'react';
import styled from 'styled-components';
import { Tooltip, useTheme } from '@mui/material';
import {
  convertGrade,
  getDifficultyColor,
  getGradeSystemName,
} from './utils/grades/routeGrade';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';
import { RouteDifficulty } from './types';

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
  routeDifficulty?: RouteDifficulty;
};

export const RouteDifficultyBadge = ({ routeDifficulty }: Props) => {
  const theme = useTheme();
  const { userSettings } = useUserSettingsContext();
  const selectedRouteSystem = userSettings['climbing.gradeSystem'];
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

  const colorByDifficulty = getDifficultyColor(routeDifficulty, theme);

  return (
    <Tooltip
      title={`${gradeValue} according to ${gradeSystemName ?? '?'}`}
      enterDelay={1500}
    >
      <Container $color={colorByDifficulty}>{gradeValue}</Container>
    </Tooltip>
  );
};
