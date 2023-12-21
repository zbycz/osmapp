import React from 'react';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { useConfig } from '../config';

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export const Bolt = ({ x, y, isPointSelected }) => {
  const { isEditMode } = useClimbingContext();
  const config = useConfig();
  const size = 16;
  const strokeWidth = 3;
  const shift = size / 2 - strokeWidth / 2;

  const dx = x + 0; /* TODO was 15 */
  const dy = y - size / 2 - strokeWidth / 2;

  const foregroundColor = isPointSelected
    ? config.belayColorSelected
    : config.belayColor;
  const borderColor = isPointSelected
    ? config.belayBorderColorSelected
    : config.belayBorderColor;

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
        stroke={borderColor}
      />
      <rect
        width={strokeWidth}
        height={size}
        x={shift}
        y={0}
        fill="transparent"
        stroke={borderColor}
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
