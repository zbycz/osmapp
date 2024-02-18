import React from 'react';
import { useConfig } from '../../config';
import { PointProps } from './pointTypes';
import { useClimbingContext } from '../../contexts/ClimbingContext';

export const Piton = ({
  x,
  y,
  isPointSelected,
  onClick,
  pointerEvents,
}: PointProps) => {
  const config = useConfig();
  const { photoZoom } = useClimbingContext();

  const foregroundColor = isPointSelected
    ? config.anchorColorSelected
    : config.anchorColor;
  const borderColor = isPointSelected
    ? config.anchorBorderColorSelected
    : config.anchorBorderColor;

  return (
    <g
      transform={` translate(${x - 4} ${y - 6}) scale(${1 / photoZoom.scale})`}
      cursor="help"
      onClick={onClick}
      pointerEvents={pointerEvents}
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
