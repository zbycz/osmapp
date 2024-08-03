import React from 'react';
import styled from 'styled-components';
import { Tooltip, useTheme } from '@mui/material';
import {
  findOrConvertRouteGrade,
  getDifficultyColor,
  getGradeSystemName,
} from './utils/grades/routeGrade';
import { useUserSettingsContext } from '../../utils/UserSettingsContext';
import { RouteDifficulty } from './types';

const TooltipGradeItemContainer = styled.div`
  white-space: nowrap;
`;

const GradeValue = styled.span`
  font-family: monospace;
  font-weight: bold;
`;

const WarningText = styled.span`
  color: ${({ theme }) => theme.palette.primary.main};
  font-weight: bold;
  font-style: italic;
`;

const Container = styled.div<{ $color: string }>`
  border-radius: 12px;
  padding: 2px 8px;
  background-color: ${({ $color }) => $color};
  display: inline-block;
  font-size: 13px;
  font-weight: 900;
  color: ${({ theme, $color }) => theme.palette.getContrastText($color)};
  font-family: monospace;
  cursor: help;
`;

const TooltipGradeItem = ({
  difficulty,
  isConverted = false,
}: {
  difficulty: RouteDifficulty;
  isConverted?: boolean;
}) => (
  <TooltipGradeItemContainer>
    <GradeValue>{difficulty.grade}</GradeValue> according to{' '}
    <strong>{getGradeSystemName(difficulty.gradeSystem)}</strong>{' '}
    {isConverted && <WarningText>(converted)</WarningText>}
  </TooltipGradeItemContainer>
);

type Props = {
  routeDifficulties?: RouteDifficulty[];
};

export const RouteDifficultyBadge = ({ routeDifficulties }: Props) => {
  const theme = useTheme();
  const { userSettings } = useUserSettingsContext();
  const selectedRouteSystem = userSettings['climbing.gradeSystem'];
  const { isConverted, routeDifficulty } = findOrConvertRouteGrade(
    routeDifficulties,
    selectedRouteSystem,
  );

  const colorByDifficulty = getDifficultyColor(routeDifficulty, theme);

  return (
    <Tooltip
      title={
        <>
          <TooltipGradeItem
            difficulty={routeDifficulty}
            isConverted={isConverted}
          />
          {routeDifficulties &&
            routeDifficulties
              .filter(
                (difficulty) =>
                  difficulty.gradeSystem !== routeDifficulty?.gradeSystem,
              )
              .map((difficulty) => (
                <TooltipGradeItem
                  difficulty={difficulty}
                  key={`${difficulty.grade}-${difficulty.gradeSystem}`}
                />
              ))}
        </>
      }
      enterDelay={1000}
      arrow
    >
      <Container $color={colorByDifficulty}>{routeDifficulty.grade}</Container>
    </Tooltip>
  );
};
