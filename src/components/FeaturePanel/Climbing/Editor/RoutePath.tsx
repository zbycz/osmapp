/* eslint-disable react/jsx-props-no-spreading */
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

export const RoutePath = ({ route, routeNumber }) => {
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
  } = useClimbingContext();
  const isSelected = isRouteSelected(routeNumber);
  const machine = getMachine();
  const path = getPathForRoute(route);
  const isMobileMode = useMobileMode();

  if (!path) return null;
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
      if (!routeIndexHovered) setRouteIndexHovered(routeNumber);

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
    setRouteIndexHovered(routeNumber);
  };

  const onMouseLeave = () => {
    setRouteIndexHovered(null);
  };

  const onPointAdd = () => {
    if (tempPointPosition) {
      machine.execute('addPointInBetween', {
        hoveredPosition: tempPointPosition,
        hoveredSegmentIndex: tempPointSegmentIndex,
      });
    }
  };

  const onMouseDown = (e) => {
    onPointAdd();

    e.stopPropagation();
  };

  const isEditableSelectedRouteHovered =
    !isPointMoving &&
    (machine.currentStateName === 'editRoute' ||
      machine.currentStateName === 'extendRoute') &&
    isSelected &&
    routeIndexHovered !== null;

  const isInteractionDisabled =
    machine.currentStateName === 'extendRoute' && !isRouteSelected(routeNumber);

  const commonProps = isEditableSelectedRouteHovered
    ? { cursor: 'copy' }
    : {
        onClick: (e) => {
          if (isInteractionDisabled) return;
          if (isEditMode) {
            machine.execute('editRoute', { routeNumber });
          } else {
            machine.execute('routeSelect', { routeNumber });
          }
          e.stopPropagation();
        },
        cursor: isInteractionDisabled ? undefined : 'pointer',
      };

  return (
    <>
      <PathWithBorder
        d={`M0 0 ${pointsInString}`}
        isSelected={isSelected}
        {...commonProps}
        // style={{ pointerEvents: arePointerEventsDisabled ? 'none' : 'all' }}
        style={{ pointerEvents: 'all' }}
        route={route}
        routeNumber={routeNumber}
      />

      {path.length > 1 &&
        path.map(({ x, y }, index) => {
          const position1 = getPixelPosition({ x, y, units: 'percentage' });

          if (path && index < path.length - 1 && !isInteractionDisabled) {
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
                key={`${routeNumber}-${index}-${x}-${y}`}
                stroke="transparent"
                strokeWidth={15}
                x1={position1.x}
                y1={position1.y}
                x2={position2.x}
                y2={position2.y}
                {...(isMobileMode ? {} : desktopProps)}
                onMouseMove={(e) => onMouseMove(e, index)}
                onClick={onMouseDown}
                {...commonProps}
              />
            );
          }
          return null;
        })}
      {isEditableSelectedRouteHovered && tempPointPosition && (
        <AddNewPoint
          cx={tempPointPosition.x}
          cy={tempPointPosition.y}
          fill="white"
          stroke="rgba(0,0,0,0.3)"
          r={5}
        />
      )}
      {machine.currentStateName === 'extendRoute' &&
        routeIndexHovered === null && (
          <MouseTrackingLine routeNumber={routeNumber} />
        )}
    </>
  );
};
