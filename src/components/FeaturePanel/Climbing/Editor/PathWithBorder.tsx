/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';
import { useConfig } from '../config';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { getDifficultyColor } from '../utils/routeGrade';

const RouteLine = styled.path`
  pointer-events: all;
`;
const RouteBorder = styled.path`
  pointer-events: all;
`;

export const PathWithBorder = ({ d, isSelected, route, ...props }) => {
  const config = useConfig();
  const { isDifficultyHeatmapEnabled } = useClimbingContext();
  const borderColor = isDifficultyHeatmapEnabled
    ? config.pathStrokeColor
    : config.pathBorderColor;
  const strokeColor = isDifficultyHeatmapEnabled
    ? getDifficultyColor(route.difficulty)
    : config.pathStrokeColor;
  return (
    <>
      <RouteBorder
        d={d}
        strokeWidth={config.pathBorderWidth}
        stroke={isSelected ? config.pathBorderColorSelected : borderColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={config.pathBorderOpacity}
        {...props}
      />
      <RouteLine
        d={d}
        strokeWidth={config.pathStrokeWidth}
        stroke={isSelected ? config.pathStrokeColorSelected : strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        // markerMid="url(#triangle)"
        pointerEvents="none"
        {...props}
      />
    </>
  );
};
