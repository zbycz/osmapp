import React from 'react';
import { useClimbingContext } from '../../contexts/ClimbingContext';
import { useConfig } from '../../config';
import { PointProps } from './pointTypes';

export const Bolt = ({
  x,
  y,
  isPointSelected,
  onClick,
  pointerEvents,
}: PointProps) => {
  const { isEditMode, photoZoom } = useClimbingContext();
  const config = useConfig();
  const size = 14;
  const strokeWidth = 2;
  const shift = size / 2 - strokeWidth / 2;

  const dx = x + 0; /* TODO was 15 */
  const dy = y - size / 2 - strokeWidth / 2;

  const foregroundColor = isPointSelected
    ? config.anchorColorSelected
    : config.anchorColor;
  const borderColor = isPointSelected
    ? config.anchorBorderColorSelected
    : config.anchorBorderColor;

  return (
    <g
      transform={`translate(${dx} ${dy}) rotate(45) scale(${
        1 / photoZoom.scale
      })`}
      cursor={!isEditMode && 'help'}
      onClick={onClick}
    >
      <rect
        width={size}
        height={strokeWidth}
        x={0}
        y={shift}
        fill="transparent"
        stroke={borderColor}
        pointerEvents={pointerEvents}
      />
      <rect
        width={strokeWidth}
        height={size}
        x={shift}
        y={0}
        fill="transparent"
        stroke={borderColor}
        pointerEvents={pointerEvents}
      />

      <rect
        width={size}
        height={strokeWidth}
        x={0}
        y={shift}
        fill={foregroundColor}
        pointerEvents={pointerEvents}
      />
      <rect
        width={strokeWidth}
        height={size}
        x={shift}
        y={0}
        fill={foregroundColor}
        pointerEvents={pointerEvents}
      />

      <title>Bolt</title>
    </g>
  );
};
