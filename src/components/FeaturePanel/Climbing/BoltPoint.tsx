import React from 'react';

export const Bolt = ({ x, y, isSelected }) => {
  const size = 10;
  const strokeWidth = 2;

  return (
    <g
      transform={` translate(${x + 10} ${
        y - size / 2 - strokeWidth / 2
      }) rotate(45)`}
      cursor="help"
    >
      <rect
        width={size}
        height={strokeWidth}
        x={0}
        y={0 + size / 2 - strokeWidth / 2}
        fill="transparent"
        stroke={isSelected ? 'white' : 'black'}
      />
      <rect
        width={strokeWidth}
        height={size}
        x={0 + size / 2 - strokeWidth / 2}
        y={0}
        fill="transparent"
        stroke={isSelected ? 'white' : 'black'}
      />
      <rect
        width={size}
        height={strokeWidth}
        x={0}
        y={0 + size / 2 - strokeWidth / 2}
        fill={isSelected ? 'black' : 'white'}
      />
      <rect
        width={strokeWidth}
        height={size}
        x={0 + size / 2 - strokeWidth / 2}
        y={0}
        fill={isSelected ? 'black' : 'white'}
      />

      <title>Bolt</title>
    </g>
  );
};
