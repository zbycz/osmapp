/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@material-ui/core';
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
  const { isDifficultyHeatmapEnabled, gradeTable, routeIndexHovered } =
    useClimbingContext();

  const strokeColor = isDifficultyHeatmapEnabled
    ? getDifficultyColor(gradeTable, route.difficulty)
    : config.pathStrokeColor;

  const getPathColor = () => {
    if (isSelected) {
      return config.pathStrokeColorSelected;
    }

    return strokeColor;
  };

  const theme = useTheme();
  const contrastColor = theme.palette.getContrastText(
    isSelected ? config.pathStrokeColorSelected : strokeColor,
  );

  return (
    <>
      <RouteBorder
        d={d}
        strokeWidth={config.pathBorderWidth}
        stroke={contrastColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={config.pathBorderOpacity}
        // pointerEvents={arePointerEventsDisabled ? 'none' : 'all'}
        {...props}
      />
      <RouteLine
        d={d}
        strokeWidth={config.pathStrokeWidth}
        stroke={getPathColor()}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
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
