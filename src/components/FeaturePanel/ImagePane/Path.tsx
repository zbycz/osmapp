import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Feature, PathType } from '../../../services/types';
import { getDifficultyColor } from '../Climbing/utils/grades/routeGrade';
import { Size } from './types';

const Svg = styled.svg`
  pointer-events: none;

  path {
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
`;

const PathBorder = styled.path`
  stroke-width: 0.8%;
  stroke: ${({ theme }) => theme.palette.climbing.borderSlider};
`;

const PathLine = styled.path<{ color: string }>`
  stroke-width: 0.6%;
  stroke: ${({ color }) => color};
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

  const color = getDifficultyColor(feature.tags, theme);

  return (
    <>
      <PathBorder d={d} />
      <PathLine d={d} color={color} />
    </>
  );
};

export const PathSvg = ({ children, size }) => (
  <Svg viewBox={`0 0 ${size.width} ${size.height}`} preserveAspectRatio="none">
    {children}
  </Svg>
);
