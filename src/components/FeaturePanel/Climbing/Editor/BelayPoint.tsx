import React from 'react';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { useConfig } from '../config';

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export const Belay = ({ x, y, isPointSelected }) => {
  const { isEditMode } = useClimbingContext();
  const config = useConfig();
  const size = 5;

  return (
    <g transform={` translate(${x + 15} ${y})`} cursor={!isEditMode && 'help'}>
      <circle
        cx={0}
        cy={0}
        fill="none"
        r={size}
        cursor="pointer"
        strokeWidth={5}
        stroke={config.belayBorderColor}
      />
      <g transform="translate(-1.5, 0)">
        <path
          d="M6.54999 0.5L6.54999 16.95"
          stroke={config.belayBorderColor}
          strokeWidth="5"
        />
        <path
          d="M2 12.75L6.55 18L11.1 12.75"
          stroke={config.belayBorderColor}
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
        stroke={config.belayColor}
      />
      <g transform="translate(-1.5, 0)">
        <path
          d="M6.54999 0.5L6.54999 16.95"
          stroke={config.belayColor}
          strokeWidth="3"
        />
        <path
          d="M2 12.75L6.55 18L11.1 12.75"
          stroke={config.belayColor}
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
