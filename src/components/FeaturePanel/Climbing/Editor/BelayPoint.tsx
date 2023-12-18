import React from 'react';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { config } from '../config';

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export const Belay = ({ x, y, isSelected }) => {
  const { isEditMode } = useClimbingContext();

  const size = 9;
  const minusHeight = 3;
  return (
    <g transform={` translate(${x} ${y})`} cursor={!isEditMode && 'help'}>
      <circle
        cx={0}
        cy={0}
        fill={config.belayColor}
        r={size}
        cursor="pointer"
        strokeWidth={1}
        stroke={config.belayBorderColor}
      />
      <rect
        width={size}
        height={minusHeight}
        x={-size / 2}
        y={-minusHeight / 2}
        fill={config.belayBorderColor}
        rx={1}
      />
      <title>Belay</title>
    </g>
  );
};
