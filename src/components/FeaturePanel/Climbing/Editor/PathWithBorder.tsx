import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@mui/material';
import { useConfig } from '../config';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { getDifficulty, getDifficultyColor } from '../utils/grades/routeGrade';
import { ClimbingRoute } from '../types';

const RouteLine = styled.path`
  pointer-events: all;
`;
const RouteBorder = styled.path`
  pointer-events: all;
`;

type Props = {
  d: string;
  routeNumber: number;
  isSelected: boolean;
  route: ClimbingRoute;
  opacity?: number;
  style?: Record<string, string>;
};

export const PathWithBorder = ({
  d,
  routeNumber,
  isSelected,
  route,
  opacity,
  style,
}: Props) => {
  const config = useConfig();
  const theme = useTheme();
  const { routeIndexHovered, isOtherRouteSelected, isEditMode } =
    useClimbingContext();

  const strokeColor = getDifficultyColor(
    getDifficulty(route.feature.tags),
    theme.palette.mode,
  );

  const contrastColor = theme.palette.getContrastText(
    isSelected ? config.pathStrokeColorSelected : strokeColor,
  );
  const isOtherSelected = isOtherRouteSelected(routeNumber);

  return (
    <>
      <RouteBorder
        d={d}
        strokeWidth={isOtherSelected ? 2 : config.pathBorderWidth}
        stroke={contrastColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={opacity ? opacity : isOtherSelected ? 0 : 1}
        style={style}
      />
      <RouteLine
        d={d}
        strokeWidth={isOtherSelected ? 1 : config.pathStrokeWidth}
        stroke={isOtherSelected ? 'white' : strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={
          opacity ? opacity : isOtherSelected ? (isEditMode ? 1 : 0.6) : 1
        }
        style={style}
      />
      {routeIndexHovered === routeNumber && (
        <RouteLine
          d={d}
          strokeWidth={config.pathStrokeWidth}
          stroke={`${config.pathStrokeColorSelected}80`}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={opacity}
          style={style}
        />
      )}
    </>
  );
};
