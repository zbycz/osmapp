import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Feature, ImagePath } from '../../../services/types';
import { getDifficultyColor } from '../Climbing/utils/grades/routeGrade';

const WIDTH = 100;
const HEIGHT = 100;

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
  stroke: ${({ theme }) => theme.palette.climbing.border};
`;

const PathLine = styled.path<{ color: string }>`
  stroke-width: 0.6%;
  stroke: ${({ color }) => color};
`;

type Props = { imagePath: ImagePath };
export const Path = ({ imagePath }: Props) => {
  const theme = useTheme();
  const d = imagePath.path
    .map(({ x, y }, idx) => `${!idx ? 'M' : 'L'}${x * WIDTH} ${y * HEIGHT}`)
    .join(',');

  const color = getDifficultyColor(imagePath.member.tags, theme);

  return (
    <>
      <PathBorder d={d} />
      <PathLine d={d} color={color} />
    </>
  );
};

export const PathSvg = ({ children }) => (
  <Svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
    {children}
  </Svg>
);
