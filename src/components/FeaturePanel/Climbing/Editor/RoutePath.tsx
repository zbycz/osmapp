/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { PositionPx } from '../types';
import { PathWithBorder } from './PathWithBorder';
import { MouseTrackingLine } from './MouseTrackingLine';

const InteractiveArea = styled.line``;
const AddNewPoint = styled.circle`
  pointer-events: none;
  cursor: copy;
`;

export const RoutePath = ({ route, routeNumber }) => {
  // const [isHovered, setIsLineInteractiveAreaHovered] = useState(false);
  // const [isDraggingPoint, setIsDraggingPoint] = useState(false);
  const [tempPointPosition, setTempPointPosition] = useState<
    PositionPx & { lineIndex: number }
  >({
    x: 0,
    y: 0,
    units: 'px',
    lineIndex: 0,
  });
  const {
    // routeSelectedIndex,
    // updateRouteOnIndex,
    isPointMoving,
    isRouteSelected,
    // setPointSelectedIndex,
    // setIsPointMoving,
    getPixelPosition,
    // getPercentagePosition,
    getMachine,
    isEditMode,
    countPositionWith,
    isLineInteractiveAreaHovered,
    setIsLineInteractiveAreaHovered,
    photoPath,
  } = useClimbingContext();
  const isSelected = isRouteSelected(routeNumber);
  const machine = getMachine();
  const pointsInString = route?.paths[photoPath].map(({ x, y }, index) => {
    const position = getPixelPosition({ x, y, units: 'percentage' });

    return `${index === 0 ? 'M' : 'L'}${position.x} ${position.y} `;
  });

  const onMouseMove = (e, lineIndex: number) => {
    if (
      machine.currentStateName === 'editRoute' ||
      machine.currentStateName === 'extendRoute'
    ) {
      if (!isLineInteractiveAreaHovered) setIsLineInteractiveAreaHovered(true);
      setTempPointPosition({
        ...countPositionWith(['editorPosition'], {
          x: e.clientX,
          y: e.clientY,
          units: 'px',
        }),
        lineIndex,
      });
    }
    // if (isDraggingPoint) {
    //   setPointSelectedIndex(tempPointPosition.lineIndex + 1);
    //   setIsPointMoving(true);
    // }
  };
  const onMouseEnter = () => {
    console.log('__ENTER');
    if (
      machine.currentStateName === 'editRoute' ||
      machine.currentStateName === 'extendRoute'
    ) {
      setIsLineInteractiveAreaHovered(true);
    }
  };

  const onMouseLeave = () => {
    if (
      machine.currentStateName === 'editRoute' ||
      machine.currentStateName === 'extendRoute'
    ) {
      setIsLineInteractiveAreaHovered(false);
    }
  };
  // const onMouseUp = () => {
  //   console.log('____onMouseUp');
  //   setIsDraggingPoint(false);
  // };

  const hoveredPosition = countPositionWith(['scrollOffset'], {
    x: tempPointPosition.x,
    y: tempPointPosition.y,
    units: 'px',
  });

  const onPointAdd = () => {
    machine.execute('addPointInBetween', {
      hoveredPosition,
      tempPointPosition,
    });
  };

  const onMouseDown = (e) => {
    console.log('____onMouseDown');
    // setIsDraggingPoint(true);
    onPointAdd();

    e.stopPropagation();
    // e.preventDefault();
  };

  const isEditableSelectedRouteHovered =
    !isPointMoving &&
    (machine.currentStateName === 'editRoute' ||
      machine.currentStateName === 'extendRoute') &&
    isSelected &&
    isLineInteractiveAreaHovered;

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

  // console.log('___', isHovered);
  const path = route.paths[photoPath];
  if (!path) return null;

  return (
    <>
      <PathWithBorder
        d={`M0 0 ${pointsInString}`}
        isSelected={isSelected}
        {...commonProps}
      />

      {/* <RouteBorder
        d={`M0 0 ${pointsInString}`}
        strokeWidth={5}
        stroke={isSelected ? 'white' : '#666'}
        strokeLinecap="round"
        fill="none"
        opacity={0.8}
        {...commonProps}
      />
      <RouteLine
        d={`M0 0 ${pointsInString}`}
        strokeWidth={3}
        stroke={isSelected ? 'royalblue' : 'white'}
        strokeLinecap="round"
        fill="none"
        // markerEnd={
        //   isSelected && machine.currentStateName === 'extendRoute' ? 'url(#triangle)' : null
        // }
        {...commonProps}
      /> */}
      {path.length > 1 &&
        path.map(({ x, y }, index) => {
          const position1 = getPixelPosition({ x, y, units: 'percentage' });

          if (path && index < path.length - 1 && !isInteractionDisabled) {
            const position2 = getPixelPosition({
              ...path[index + 1],
              units: 'percentage',
            });
            return (
              <InteractiveArea
                stroke="transparent"
                strokeWidth={20}
                x1={position1.x}
                y1={position1.y}
                x2={position2.x}
                y2={position2.y}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseMove={(e) => onMouseMove(e, index)}
                // onMouseDown={onMouseDown}
                onClick={onMouseDown}
                // onMouseUp={onMouseUp}
                {...commonProps}
              />
            );
          }
          return null;
        })}
      {isEditableSelectedRouteHovered && (
        <AddNewPoint
          cx={hoveredPosition.x}
          cy={hoveredPosition.y}
          fill="white"
          stroke="rgba(0,0,0,0.3)"
          r={5}
        />
      )}
      {machine.currentStateName === 'extendRoute' &&
        !isLineInteractiveAreaHovered && (
          <MouseTrackingLine routeNumber={routeNumber} />
        )}
    </>
  );
};
