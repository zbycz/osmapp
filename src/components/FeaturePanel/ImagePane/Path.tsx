import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Feature, PathType } from '../../../services/types';
import {
  getDifficulty,
  getDifficultyColor,
} from '../Climbing/utils/grades/routeGrade';
import { Size } from './types';

const Svg = styled.svg`
  pointer-events: none;

  path {
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
`;

const PathBorder = styled.path<{ $color: string }>`
  stroke-width: 1.3%;
  stroke: ${({ $color }) => $color};
`;

const PathLine = styled.path<{ $color: string }>`
  stroke-width: 1%;
  stroke: ${({ $color }) => $color};
`;

type Props = {
  path: PathType;
  feature: Feature;
  size: Size;
};
export const Path = ({ path, feature, size }: Props) => {
  const theme = useTheme();

  const d = path
    .map(
      ({ x, y }, idx) =>
        `${!idx ? 'M' : 'L'}${x * size.width} ${y * size.height}`,
    )
    .join(',');

  const color = getDifficultyColor(getDifficulty(feature.tags), theme);
  const contrastColor = theme.palette.getContrastText(color);

  return (
    <>
      <PathBorder d={d} $color={contrastColor} />
      <PathLine d={d} $color={color} />
    </>
  );
};

export const PathSvg = ({ children, size }) => (
  <Svg viewBox={`0 0 ${size.width} ${size.height}`} preserveAspectRatio="none">
    {children}
  </Svg>
);
