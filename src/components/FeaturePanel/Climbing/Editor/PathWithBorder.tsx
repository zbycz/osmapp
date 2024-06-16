/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@mui/material';
import { useConfig } from '../config';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { getDifficultyColor } from '../utils/routeGrade';

const RouteLine = styled.path`
  pointer-events: all;
`;
const RouteBorder = styled.path`
  pointer-events: all;
`;

export const PathWithBorder = ({
  d,
  routeNumber,
  isSelected,
  route,
  ...props
}) => {
  const config = useConfig();
  const {
    isDifficultyHeatmapEnabled,
    gradeTable,
    routeIndexHovered,
    isOtherRouteSelected,
  } = useClimbingContext();

  const strokeColor = isDifficultyHeatmapEnabled
    ? getDifficultyColor(gradeTable, route.difficulty)
    : config.pathStrokeColor;

  const theme = useTheme();
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
        opacity={isOtherSelected ? 0 : 1}
        // pointerEvents={arePointerEventsDisabled ? 'none' : 'all'}
        {...props}
      />
      <RouteLine
        d={d}
        strokeWidth={config.pathStrokeWidth}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={isOtherSelected ? 0 : 1}
        // markerMid="url(#triangle)"
        // pointerEvents={arePointerEventsDisabled ? 'none' : 'all'}
        {...props}
      />
      {routeIndexHovered === routeNumber && (
        <RouteLine
          d={d}
          strokeWidth={config.pathStrokeWidth}
          stroke={`${config.pathStrokeColorSelected}80`}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          {...props}
        />
      )}
    </>
  );
};
