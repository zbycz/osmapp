import { LineType, PositionPx } from '../types';
import React from 'react';
import { useMobileMode } from '../../../helpers';

type RouteLineProps = {
  pathPx: PositionPx[];
  strokeWidth: number;
  stroke: string;
  opacity?: number;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent, segmentIndex: number) => void;
  cursor?: string;
};
export const RouteLine = ({
  pathPx,
  strokeWidth,
  stroke,
  opacity,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onClick,
  cursor,
}: RouteLineProps) => {
  const isMobileMode = useMobileMode();

  const getLineDasharray = (previousLineType: LineType) => {
    if (previousLineType === 'dotted') {
      if (isMobileMode) {
        return '0.6 4';
      }
      return '0.3 9';
    }

    return undefined;
  };

  return (
    <>
      {pathPx.slice(0, -1).map((position1, segmentIndex) => {
        const position2 = pathPx[segmentIndex + 1];

        return (
          <line
            // eslint-disable-next-line react/no-array-index-key
            key={segmentIndex}
            stroke={stroke}
            strokeWidth={strokeWidth}
            x1={position1.x}
            y1={position1.y}
            x2={position2.x}
            y2={position2.y}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
            onClick={(e) => onClick?.(e, segmentIndex)}
            cursor={cursor}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={opacity}
            strokeDasharray={getLineDasharray(position2.previousLineType)}
          />
        );
      })}
    </>
  );
};
