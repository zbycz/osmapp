import React from 'react';
import { useConfig } from '../../config';
import { PointProps } from './PointTypes';

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export const Piton = ({ x, y, isPointSelected, onClick }: PointProps) => {
  const config = useConfig();

  const foregroundColor = isPointSelected
    ? config.anchorColorSelected
    : config.anchorColor;
  const borderColor = isPointSelected
    ? config.anchorBorderColorSelected
    : config.anchorBorderColor;

  return (
    <g
      transform={` translate(${x - 4} ${y - 6})`}
      cursor="help"
      onClick={onClick}
    >
      <g>
        <path
          d="M1.72357 5.2168L24 1.6255"
          stroke={borderColor}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <circle
          cx="18.4758"
          cy="6.49978"
          r="3.37429"
          stroke={borderColor}
          strokeWidth="4"
          fill="none"
        />
      </g>

      <g>
        <path
          d="M1.72357 5.2168L24 1.6255"
          stroke={foregroundColor}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle
          cx="18.4758"
          cy="6.49978"
          r="3.37429"
          stroke={foregroundColor}
          strokeWidth="2"
          fill="none"
        />
      </g>
      <title>Piton</title>
    </g>
  );
};