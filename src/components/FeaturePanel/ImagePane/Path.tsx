import React from 'react';
import styled from 'styled-components';

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
  stroke-width: 2%;
  stroke: ${({ theme }) => theme.palette.climbing.border};
`;

const PathLine = styled.path`
  stroke-width: 1%;
  stroke: ${({ theme }) => theme.palette.climbing.inactive};
`;

export const Path = ({ points }) => {
  const d = points
    .map(({ x, y }, idx) => `${!idx ? 'M' : 'L'}${x * WIDTH} ${y * HEIGHT}`)
    .join(',');

  return (
    <>
      <PathBorder d={d} />
      <PathLine d={d} />
    </>
  );
};

export const PathSvg = ({ children }) => (
  <Svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
    {children}
  </Svg>
);
