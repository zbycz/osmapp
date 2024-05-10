import React from 'react';
import styled from 'styled-components';

const PathBorder = styled.path`
  stroke-width: 3;
  stroke: ${({ theme }) => theme.palette.climbing.border};
`;

const PathLine = styled.path`
  stroke-width: 2;
  stroke: ${({ theme }) => theme.palette.climbing.inactive};
`;

export const Path = ({ points, width, height }) => {
  const d = points
    .map(({ x, y }, idx) => `${!idx ? 'M' : 'L'}${x * width} ${y * height}`)
    .join(',');

  return (
    <>
      <PathBorder d={d} />
      <PathLine d={d} />
    </>
  );
};
