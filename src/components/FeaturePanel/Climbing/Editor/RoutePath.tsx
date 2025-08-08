import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { PositionPx } from '../types';
import { PathWithBorder } from './PathWithBorder';
import { MouseTrackingLine } from './MouseTrackingLine';
import { getPositionInImageFromMouse } from '../utils/mousePositionUtils';
import { useMobileMode } from '../../../helpers';

const InteractiveArea = styled.line`
  pointer-events: all;
`;
const AddNewPoint = styled.circle`
  pointer-events: none;
  cursor: copy;
`;

type Props = {
  routeIndex: number;
};

export const RoutePath = ({ routeIndex }: Props) => {
  const [tempPointPosition, setTempPointPosition] = useState<PositionPx | null>(
    null,
  );
  const [tempPointSegmentIndex, setTempPointSegmentIndex] = useState<
    number | null
  >(null);
  const {
    isPointMoving,
    isRouteSelected,
    getPixelPosition,
    getMachine,
    isEditMode,
    routeIndexHovered,
    setRouteIndexHovered,
    getPathForRoute,
    svgRef,
    photoZoom,
    routes,
  } = useClimbingContext();
  const isSelected = isRouteSelected(routeIndex);
  const machine = getMachine();
  const route = routes[routeIndex];
  const path = getPathForRoute(route);
  const isMobileMode = useMobileMode();

  if (!path) {
    return null;
  }

  const pointsInString = path
    .map(({ x, y }, index) => {
      const position = getPixelPosition({ x, y, units: 'percentage' });

      return `${index === 0 ? 'M' : 'L'}${position.x} ${position.y} `;
    })
    .join('');

  const onMouseMove = (e, segmentIndex: number) => {
    if (
      machine.currentStateName === 'editRoute' ||
      machine.currentStateName === 'extendRoute'
    ) {
      if (!routeIndexHovered) setRouteIndexHovered(routeIndex);

      const mousePosition: PositionPx = {
        x: e.clientX,
        y: e.clientY,
        units: 'px',
      };
      const positionInImage = getPositionInImageFromMouse(
        svgRef,
        mousePosition,
        photoZoom,
      );

      setTempPointPosition(positionInImage);
      setTempPointSegmentIndex(segmentIndex);
    }
  };

  const onMouseEnter = () => {
    setRouteIndexHovered(routeIndex);
  };

  const onMouseLeave = () => {
    setRouteIndexHovered(null);
  };

  const isMidpointAddScenario =
    !isPointMoving &&
    (machine.currentStateName === 'editRoute' ||
      machine.currentStateName === 'extendRoute') &&
    isSelected &&
    routeIndexHovered !== null;

  const isExtendingDifferentRoute =
    machine.currentStateName === 'extendRoute' && !isRouteSelected(routeIndex);

  const onClick = (e) => {
    if (isMidpointAddScenario) {
      if (tempPointPosition) {
        machine.execute('addPointInBetween', {
          hoveredPosition: tempPointPosition,
          hoveredSegmentIndex: tempPointSegmentIndex,
        });
      }
    } else if (isEditMode) {
      machine.execute('editRoute', { routeIndex });
    } else {
      machine.execute('routeSelect', { routeIndex });
    }
    e.stopPropagation();
  };

  return (
    <>
      <PathWithBorder
        d={`M0 0 ${pointsInString}`}
        isSelected={isSelected}
        route={route}
        routeNumber={routeIndex}
      />

      {!isExtendingDifferentRoute &&
        path.length > 2 &&
        path.slice(0, -1).map(({ x, y }, index) => {
          const position1 = getPixelPosition({ x, y, units: 'percentage' });
          const position2 = getPixelPosition({
            ...path[index + 1],
            units: 'percentage',
          });

          const desktopProps = {
            onMouseEnter: onMouseEnter,
            onMouseLeave: onMouseLeave,
          };
          return (
            <InteractiveArea
              // eslint-disable-next-line react/no-array-index-key
              key={`${routeIndex}-${index}-${x}-${y}`}
              stroke="transparent"
              strokeWidth={15}
              x1={position1.x}
              y1={position1.y}
              x2={position2.x}
              y2={position2.y}
              {...(isMobileMode ? {} : desktopProps)}
              onMouseMove={(e) => onMouseMove(e, index)}
              onClick={onClick}
              cursor={isMidpointAddScenario ? 'copy' : 'pointer'}
            />
          );
        })}
      {isMidpointAddScenario && tempPointPosition && (
        <AddNewPoint
          cx={tempPointPosition.x}
          cy={tempPointPosition.y}
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
