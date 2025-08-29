import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@mui/material';
import { useConfig } from '../config';
import { useClimbingContext } from '../contexts/ClimbingContext';
import {
  getDifficulty,
  getDifficultyColor,
} from '../../../../services/tagging/climbing/routeGrade';
import { useMobileMode } from '../../../helpers';

const RouteLine = styled.path`
  pointer-events: none;
`;
const RouteBorder = styled.path`
  pointer-events: none;
`;

type Props = {
  d: string; // TODO this should be moved inside this components
  routeIndex: number;
  opacity?: number;
};

export const PathWithBorder = ({ d, routeIndex, opacity }: Props) => {
  const isMobileMode = useMobileMode();
  const config = useConfig();
  const theme = useTheme();
  const {
    routeIndexHovered,
    isOtherRouteSelected,
    isEditMode,
    routes,
    isRouteSelected,
  } = useClimbingContext();

  const route = routes[routeIndex];
  const isSelected = isRouteSelected(routeIndex);

  const strokeColor = getDifficultyColor(
    getDifficulty(route.feature.tags),
    theme.palette.mode,
  );

  const contrastColor = theme.palette.getContrastText(
    isSelected ? config.pathStrokeColorSelected : strokeColor,
  );
  const isOtherSelected = isOtherRouteSelected(routeIndex);

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
      />
      {!isMobileMode && routeIndexHovered === routeIndex && (
        <RouteLine
          d={d}
          strokeWidth={config.pathStrokeWidth}
          stroke={`${config.pathStrokeColorSelected}80`}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={opacity}
        />
      )}
    </>
  );
};
