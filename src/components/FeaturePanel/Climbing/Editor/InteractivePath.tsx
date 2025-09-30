import styled from '@emotion/styled';
import React, { useState } from 'react';
import { PositionPx } from '../types';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { useMobileMode } from '../../../helpers';
import { getPositionInImageFromMouse } from '../utils/mousePositionUtils';
import { MouseTrackingLine } from './MouseTrackingLine';
import { RouteLine } from './RouteLine';

const InteractiveRectangle = styled.line`
  pointer-events: all;
  stroke-linecap: round;
`;

const NewMidpoint = styled.circle`
  pointer-events: none;
`;

const useTempMidpoint = () => {
  const [midpoint, setMidpoint] = useState<PositionPx | null>(null);
  const { machine, svgRef, photoZoom } = useClimbingContext();

  const setMidpointPosition = (e: React.MouseEvent) => {
    if (
      machine.currentStateName === 'editRoute' ||
      machine.currentStateName === 'extendRoute'
    ) {
      setMidpoint(getPositionInImageFromMouse(svgRef, e, photoZoom));
    }
  };

  return { midpoint, setMidpointPosition };
};

type Props = {
  routeIndex: number;
  allowHoverMidpoint?: boolean;
};

export const InteractivePath = ({ routeIndex, allowHoverMidpoint }: Props) => {
  const isMobileMode = useMobileMode();
  const { midpoint, setMidpointPosition } = useTempMidpoint();
  const {
    isPointMoving,
    isRouteSelected,
    getPixelPosition,
    machine,
    isEditMode,
    routeIndexHovered,
    setRouteIndexHovered,
    getPathForRoute,
    svgRef,
    photoZoom,
    routes,
  } = useClimbingContext();
  const isSelected = isRouteSelected(routeIndex);
  const route = routes[routeIndex];
  const path = getPathForRoute(route);
  if (!path) {
    return null;
  }

  const setHover = () => setRouteIndexHovered(routeIndex);
  const unsetHover = () => setRouteIndexHovered(null);

  const isMidpointAddScenario =
    isSelected &&
    !isPointMoving &&
    (machine.currentStateName === 'editRoute' ||
      machine.currentStateName === 'extendRoute');

  const isExtendingDifferentRoute =
    machine.currentStateName === 'extendRoute' && !isRouteSelected(routeIndex);

  if (isExtendingDifferentRoute || path.length < 2) {
    return null;
  }

  const onClick = (e: React.MouseEvent, segmentIndex: number) => {
    if (isMidpointAddScenario) {
      machine.execute('addPointInBetween', {
        hoveredPosition: getPositionInImageFromMouse(svgRef, e, photoZoom),
        hoveredSegmentIndex: segmentIndex,
      });
      e.stopPropagation();
      return;
    }

    if (isEditMode) {
      machine.execute('editRoute', { routeNumber: routeIndex });
    } else {
      machine.execute('routeSelect', { routeNumber: routeIndex });
    }
    e.stopPropagation();
  };

  const pathPx = path.map(getPixelPosition);

  return (
    <>
      <RouteLine
        pathPx={pathPx}
        stroke="transparent"
        strokeWidth={15}
        onMouseEnter={isMobileMode ? undefined : setHover}
        onMouseLeave={isMobileMode ? undefined : unsetHover}
        onMouseMove={isMobileMode ? undefined : setMidpointPosition}
        onClick={onClick}
        cursor={isMidpointAddScenario ? 'copy' : 'pointer'}
      />

      {allowHoverMidpoint && isMidpointAddScenario && midpoint && (
        <NewMidpoint
          cx={midpoint.x}
          cy={midpoint.y}
          fill="white"
          stroke="rgba(0,0,0,0.3)"
          r={7 / photoZoom.scale}
          strokeWidth={1 / photoZoom.scale}
        />
      )}
      {machine.currentStateName === 'extendRoute' &&
        routeIndexHovered === null && (
          <MouseTrackingLine routeIndex={routeIndex} />
        )}
    </>
  );
};
