import React from 'react';
import { useConfig } from '../../config';
import { PointProps } from './PointTypes';

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export const Sling = ({ x, y, isPointSelected, onClick }: PointProps) => {
  const config = useConfig();

  const foregroundColor = isPointSelected
    ? config.anchorColorSelected
    : config.anchorColor;
  const borderColor = isPointSelected
    ? config.anchorBorderColorSelected
    : config.anchorBorderColor;

  return (
    <g
      transform={` translate(${x + 15} ${y - 10})`}
      cursor="help"
      onClick={onClick}
    >
      <path
        d="M2 2C4.66667 4.74576 10.6667 9.32203 10.6667 14.2034C10.6667 17.5593 9.33333 20 7 20C4.66667 20 3.33333 17.5593 3.33333 14.2034C3.33333 9.32203 9.33333 4.74576 12 2"
        stroke={borderColor}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      <path
        d="M2 2C4.66667 4.74576 10.6667 9.32203 10.6667 14.2034C10.6667 17.5593 9.33333 20 7 20C4.66667 20 3.33333 17.5593 3.33333 14.2034C3.33333 9.32203 9.33333 4.74576 12 2"
        stroke={foregroundColor}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      <title>Sling</title>
    </g>
  );
};
