import React from 'react';
import { useClimbingContext } from '../contexts/ClimbingContext';

export const Belay = ({ x, y /* isSelected */ }) => {
  const { isEditMode } = useClimbingContext();

  const size = 9;
  const minusHeight = 3;
  return (
    <g transform={` translate(${x} ${y})`} cursor={!isEditMode && 'help'}>
      <circle
        cx={0}
        cy={0}
        fill={false /* isSelected */ ? 'royalblue' : 'white'}
        r={size}
        cursor="pointer"
        strokeWidth={1}
        stroke={false /* isSelected */ ? 'white' : '#666'}
      />
      <rect
        width={size}
        height={minusHeight}
        x={-size / 2}
        y={-minusHeight / 2}
        fill={false /* isSelected */ ? 'white' : '#666'}
        rx={1}
      />
      <title>Belay</title>
    </g>
  );
};
