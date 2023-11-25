import React from 'react';

export const Belay = ({ x, y, isSelected }) => {
  const size = 9;
  const minusHeight = 3;
  return (
    <g transform={` translate(${x} ${y})`} cursor="help">
      <circle
        cx={0}
        cy={0}
        fill={isSelected ? 'royalblue' : 'white'}
        r={size}
        cursor="pointer"
        strokeWidth={1}
        stroke={isSelected ? 'white' : '#666'}
      />
      <rect
        width={size}
        height={minusHeight}
        x={-size / 2}
        y={-minusHeight / 2}
        fill={isSelected ? 'white' : '#666'}
        rx={1}
      />
      <title>Belay</title>
    </g>
  );
};
