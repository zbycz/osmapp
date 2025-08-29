import React from 'react';
import { useTheme } from '@mui/material';
import { useConfig } from '../config';
import { useClimbingContext } from '../contexts/ClimbingContext';
import {
  getDifficulty,
  getDifficultyColor,
} from '../../../../services/tagging/climbing/routeGrade';
import { useMobileMode } from '../../../helpers';
import { PathPoints } from '../types';
import { RouteLine } from './RouteLine';

type Props = {
  path: PathPoints;
  routeIndex: number;
  opacity?: number;
};

export const PathWithBorder = ({ path, routeIndex, opacity }: Props) => {
  const isMobileMode = useMobileMode();
  const config = useConfig();
  const theme = useTheme();
  const {
    routeIndexHovered,
    isOtherRouteSelected,
    isEditMode,
    routes,
    isRouteSelected,
    getPixelPosition,
  } = useClimbingContext();

  const pathPx = path.map(getPixelPosition);

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

  const BorderPath = () => (
    <RouteLine
      pathPx={pathPx}
      strokeWidth={isOtherSelected ? 2 : config.pathBorderWidth}
      stroke={contrastColor}
      opacity={opacity ? opacity : isOtherSelected ? 0 : 1}
    />
  );

  const RoutePath = () => (
    <RouteLine
      pathPx={pathPx}
      strokeWidth={isOtherSelected ? 1 : config.pathStrokeWidth}
      stroke={isOtherSelected ? 'white' : strokeColor}
      opacity={opacity ? opacity : isOtherSelected ? (isEditMode ? 1 : 0.6) : 1}
    />
  );

  const HoverPath = () =>
    !isMobileMode && routeIndexHovered === routeIndex ? (
      <RouteLine
        pathPx={pathPx}
        strokeWidth={config.pathStrokeWidth}
        stroke={`${config.pathStrokeColorSelected}80`}
        opacity={opacity}
      />
    ) : null;

  return (
    <>
      <BorderPath />
      <RoutePath />
      <HoverPath />
    </>
  );
};
