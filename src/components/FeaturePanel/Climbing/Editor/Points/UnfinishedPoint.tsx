import React from 'react';
import { useClimbingContext } from '../../contexts/ClimbingContext';
import { useConfig } from '../../config';
import { PointProps } from './pointTypes';
import { usePointClickHandler } from '../utils';

export const UnfinishedPoint = ({
  x,
  y,
  isPointSelected,
  pointIndex,
  pointerEvents,
}: PointProps) => {
  const { isEditMode, photoZoom } = useClimbingContext();
  const onClick = usePointClickHandler(pointIndex);
  const config = useConfig();

  const strokeWidth = 1;
  const size = 12;
  const dx = x - size / 2 - strokeWidth / 2;
  const dy = y + size / 2 + strokeWidth / 2;
  const foregroundColor = isPointSelected
    ? config.anchorColorSelected
    : config.anchorColor;
  const borderColor = isPointSelected
    ? config.anchorBorderColorSelected
    : config.anchorBorderColor;

  return (
    <g
      transform={`translate(${dx} ${dy}) scale(${1 / photoZoom.scale})`}
      cursor={!isEditMode && 'help'}
      onClick={onClick}
    >
      <polygon
        stroke={borderColor}
        fill={foregroundColor}
        pointerEvents={pointerEvents}
        strokeWidth={strokeWidth}
        points={`0,0 ${size},0 ${size / 2},-${size}`}
      >
        <title>Unfinished point</title>
      </polygon>
    </g>
  );
};
