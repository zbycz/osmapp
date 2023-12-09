import React from 'react';
import { useClimbingContext } from '../contexts/ClimbingContext';

export const Bolt = ({ x, y /*isSelected*/ }) => {
  const { isEditMode } = useClimbingContext();

  const size = 16;
  const strokeWidth = 4;
  const shift = size / 2 - strokeWidth / 2;

  const backgroundColor = false /* isSelected */ ? 'white' : 'black';
  const foregroundColor = false /* isSelected */ ? 'royalblue' : 'white';

  const dx = x + 0; /* TODO was 15 */
  const dy = y - size / 2 - strokeWidth / 2;

  return (
    <g
      transform={`translate(${dx} ${dy}) rotate(45)`}
      cursor={!isEditMode && 'help'}
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
