import React from 'react';
import styled from 'styled-components';
import { Tooltip, useTheme } from '@mui/material';
import { getDifficultyColor } from './utils/grades/routeGrade';
import { RouteDifficulty } from './types';

const Container = styled.div<{ $color: string; $isTooltipActive: boolean }>`
  border-radius: 12px;
  padding: 2px 8px;
  background-color: ${({ $color }) => $color};
  display: inline-block;
  font-size: 13px;
  font-weight: 900;
  color: ${({ theme, $color }) => theme.palette.getContrastText($color)};
  font-family: monospace;
  cursor: ${({ $isTooltipActive }) => ($isTooltipActive ? 'help' : undefined)};
`;

type Props = {
  routeDifficulty: RouteDifficulty;
  tooltip?: React.ReactNode;
};

export const RouteDifficultyBadge = ({ routeDifficulty, tooltip }: Props) => {
  const theme = useTheme();

  const colorByDifficulty = getDifficultyColor(routeDifficulty, theme);

  return (
    <Tooltip title={tooltip} enterDelay={1000} arrow>
      <Container $color={colorByDifficulty} $isTooltipActive={Boolean(tooltip)}>
        {routeDifficulty.grade}
      </Container>
    </Tooltip>
  );
};
