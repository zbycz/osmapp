/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ClimbingContext } from '../contexts/climbingContext';
import { EditorPosition } from '../types';

const RouteLine = styled.path``;
const RouteBorder = styled.path``;
const InteractiveArea = styled.line``;
const AddNewPoint = styled.circle`
  pointer-events: none;
  cursor: copy;
`;

export const RoutePath = ({ onRouteSelect, route, routeNumber }) => {
  const [isHovered, setIsHovered] = useState(false);
  // const [isDraggingPoint, setIsDraggingPoint] = useState(false);
  const [tempPointPosition, setTempPointPosition] = useState<
    EditorPosition & { lineIndex: number }
  >({
    top: 0,
    left: 0,
    lineIndex: 0,
  });
  const {
    imageSize,
    isSelectedRouteEditable,
    routeSelectedIndex,
    editorPosition,
    updateRouteOnIndex,
    isPointMoving,
    isRouteSelected,
    // setPointSelectedIndex,
    // setIsPointMoving,
  } = useContext(ClimbingContext);
  const isSelected = isRouteSelected(routeNumber);

  const pointsInString = route?.path.map(({ x, y }, index) => {
    const currentX = imageSize.width * x;
    const currentY = imageSize.height * y;
    return `${index === 0 ? 'M' : 'L'}${currentX} ${currentY} `;
  });

  const onMouseMove = (e, lineIndex: number) => {
    if (isSelectedRouteEditable) {
      if (!isHovered) setIsHovered(true);
      setTempPointPosition({
        left: e.clientX - editorPosition.left,
        top: e.clientY - editorPosition.top,
        lineIndex,
      });
    }
    // if (isDraggingPoint) {
    //   setPointSelectedIndex(tempPointPosition.lineIndex + 1);
    //   setIsPointMoving(true);
    // }
  };
  const onMouseEnter = () => {
    if (isSelectedRouteEditable) {
      setIsHovered(true);
    }
  };

  const onMouseLeave = () => {
    if (isSelectedRouteEditable) {
      setIsHovered(false);
    }
  };
  // const onMouseUp = () => {
  //   console.log('____onMouseUp');
  //   setIsDraggingPoint(false);
  // };

  const onPointAdd = () => {
    updateRouteOnIndex(routeSelectedIndex, (currentRoute) => ({
      ...currentRoute,
      path: [
        ...currentRoute.path.slice(0, tempPointPosition.lineIndex + 1),
        {
          x: tempPointPosition.left / imageSize.width,
          y: tempPointPosition.top / imageSize.height,
        },
        ...currentRoute.path.slice(tempPointPosition.lineIndex + 1),
      ],
    }));
  };

  const onMouseDown = (e) => {
    console.log('____onMouseDown');
    // setIsDraggingPoint(true);
    onPointAdd();

    e.stopPropagation();
    // e.preventDefault();
  };

  const isEditableSelectedRouteHovered =
    !isPointMoving && isSelectedRouteEditable && isSelected && isHovered;
  // console.log(
  //   '________',
  //   !isPointMoving,
  //   isSelectedRouteEditable,
  //   isSelected,
  //   isHovered,
  // );

  const commonProps = isEditableSelectedRouteHovered
    ? { cursor: 'copy' }
    : {
        onClick: (e) => {
          onRouteSelect(routeNumber);
          e.stopPropagation();
        },
        cursor: 'pointer',
      };

  return (
    <>
      <RouteBorder
        d={`M0 0 ${pointsInString}`}
        strokeWidth={5}
        stroke={isSelected ? 'white' : '#666'}
        strokeLinecap="round"
        fill="none"
        {...commonProps}
      />
      <RouteLine
        d={`M0 0 ${pointsInString}`}
        strokeWidth={3}
        stroke={isSelected ? 'royalblue' : 'white'}
        strokeLinecap="round"
        fill="none"
        markerEnd={
          isSelected && isSelectedRouteEditable ? 'url(#triangle)' : null
        }
        {...commonProps}
      />
      {route.path.length > 1 &&
        route.path.map(({ x, y }, index) => {
          if (route?.path && index < route.path.length - 1) {
            return (
              <InteractiveArea
                stroke="transparent"
                strokeWidth={20}
                x1={imageSize.width * x}
                y1={imageSize.height * y}
                x2={imageSize.width * route.path[index + 1].x}
                y2={imageSize.height * route.path[index + 1].y}
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
          cx={tempPointPosition.left}
          cy={tempPointPosition.top}
          fill="white"
          stroke="rgba(0,0,0,0.3)"
          r={5}
        />
      )}
    </>
  );
};
