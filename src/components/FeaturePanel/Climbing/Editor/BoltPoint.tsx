import React from 'react';

export const Bolt = ({ x, y, isSelected }) => {
  const size = 16;
  const strokeWidth = 4;
  const shift = size / 2 - strokeWidth / 2;

  const backgroundColor = isSelected ? 'white' : 'black';
  const foregroundColor = isSelected ? 'royalblue' : 'white';

  return (
    <g
      transform={` translate(${x + 15} ${
        y - size / 2 - strokeWidth / 2
      }) rotate(45)`}
      cursor="help"
    >
      <rect
        width={size}
        height={strokeWidth}
        x={0}
        y={shift}
        fill="transparent"
        stroke={backgroundColor}
      />
      <rect
        width={strokeWidth}
        height={size}
        x={shift}
        y={0}
        fill="transparent"
        stroke={backgroundColor}
      />

      <rect
        width={size}
        height={strokeWidth}
        x={0}
        y={shift}
        fill={foregroundColor}
      />
      <rect
        width={strokeWidth}
        height={size}
        x={shift}
        y={0}
        fill={foregroundColor}
      />

      <title>Bolt</title>
    </g>
  );
};
