import React from 'react';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { config } from '../config';

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export const Bolt = ({ x, y, isSelected }) => {
  const { isEditMode } = useClimbingContext();

  const size = 16;
  const strokeWidth = 4;
  const shift = size / 2 - strokeWidth / 2;

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
        stroke={config.belayBorderColor}
      />
      <rect
        width={strokeWidth}
        height={size}
        x={shift}
        y={0}
        fill="transparent"
        stroke={config.belayBorderColor}
      />

      <rect
        width={size}
        height={strokeWidth}
        x={0}
        y={shift}
        fill={config.belayColor}
      />
      <rect
        width={strokeWidth}
        height={size}
        x={shift}
        y={0}
        fill={config.belayColor}
      />

      <title>Bolt</title>
    </g>
  );
};
