import React from 'react';
import { useConfig } from '../../config';
import { PointProps } from './pointTypes';

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export const Anchor = ({
  x,
  y,
  isPointSelected,
  onClick,
  pointerEvents,
}: PointProps) => {
  const config = useConfig();
  const size = 5;

  const foregroundColor = isPointSelected
    ? config.anchorColorSelected
    : config.anchorColor;
  const borderColor = isPointSelected
    ? config.anchorBorderColorSelected
    : config.anchorBorderColor;

  return (
    <g
      transform={` translate(${x + 15} ${y})`}
      cursor="help"
      onClick={onClick}
      pointerEvents={pointerEvents}
    >
      <circle
        cx={0}
        cy={0}
        fill="none"
        r={size}
        cursor="pointer"
        strokeWidth={5}
        stroke={borderColor}
      />
      <g transform="translate(-1.5, 0)">
        <path
          d="M6.54999 0.5L6.54999 16.95"
          stroke={borderColor}
          strokeWidth="5"
        />
        <path
          d="M2 12.75L6.55 18L11.1 12.75"
          stroke={borderColor}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <circle
        cx={0}
        cy={0}
        fill="none"
        r={size}
        cursor="pointer"
        strokeWidth={3}
        stroke={foregroundColor}
      />
      <g transform="translate(-1.5, 0)">
        <path
          d="M6.54999 0.5L6.54999 16.95"
          stroke={foregroundColor}
          strokeWidth="3"
        />
        <path
          d="M2 12.75L6.55 18L11.1 12.75"
          stroke={foregroundColor}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <title>Anchor</title>
      </g>
    </g>
  );
};
