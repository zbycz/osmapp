import React from 'react';
import { useTheme } from '@mui/material';
import {
  findOrConvertRouteGrade,
  getDifficulties,
  getDifficulty,
  getDifficultyColor,
} from '../../../../services/tagging/climbing/routeGrade';
import { ClimbingRoute } from '../types';
import { useUserSettingsContext } from '../../../utils/UserSettingsContext';
import { useClimbingContext } from '../contexts/ClimbingContext';

type Props = {
  route: ClimbingRoute;
  x: number;
  y: number;
};

const Text = ({ children, scale, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <text textAnchor="middle" fontWeight="bold" fontSize={11 / scale} {...rest}>
    {children}
  </text>
);

const TextOutline = ({ children, x, y, stroke, scale }) => (
  <Text x={x} y={y} strokeWidth={3 / scale} stroke={stroke} scale={scale}>
    {children}
  </Text>
);

export const RouteDifficulty = ({ route, x, y }: Props) => {
  const theme = useTheme();
  const { userSettings } = useUserSettingsContext();
  const {
    photoZoom: { scale },
  } = useClimbingContext();
  const color = getDifficultyColor(
    getDifficulty(route.feature.tags),
    theme.palette.mode,
  );
  const routeDifficulties = getDifficulties(route.feature?.tags);
  const selectedRouteSystem = userSettings['climbing.gradeSystem'];
  const { routeDifficulty } = findOrConvertRouteGrade(
    routeDifficulties,
    selectedRouteSystem,
  );

  return (
    <>
      <TextOutline
        x={x}
        y={y}
        stroke={theme.palette.getContrastText(color)}
        scale={scale}
      >
        {routeDifficulty.grade}
      </TextOutline>
      <Text x={x} y={y} fill={color} scale={scale}>
        {routeDifficulty.grade}
      </Text>
    </>
  );
};
