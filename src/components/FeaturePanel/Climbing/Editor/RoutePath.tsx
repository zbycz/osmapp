/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useState } from 'react';
import { debounce } from 'lodash';
import { ClimbingContext } from '../contexts/climbingContext';
import { EditorPosition } from '../types';

export const RoutePath = ({ onRouteSelect, route, routeNumber }) => {
  const [isHovered, setIsHovered] = useState(false);
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
  } = useContext(ClimbingContext);
  const isSelected = routeSelectedIndex === routeNumber;
  const pointsInString = route?.path.map(({ x, y }, index) => {
    const currentX = imageSize.width * x;
    const currentY = imageSize.height * y;
    return `${index === 0 ? 'M' : 'L'}${currentX} ${currentY} `;
  });

  const onMouseMove = (e, lineIndex: number) => {
    if (isSelectedRouteEditable) {
      console.log(
        e.clientX,
        e.clientY,
        editorPosition.left,
        editorPosition.top,
      );
      setTempPointPosition({
        left: e.clientX - editorPosition.left,
        top: e.clientY - editorPosition.top,
        lineIndex,
      });
    }
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
  const onPointAdd = (e) => {
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
    e.stopPropagation();
  };

  const commonProps = isSelectedRouteEditable
    ? { cursor: 'copy' }
    : {
        onClick: (e) => {
          onRouteSelect(routeNumber);
          e.stopPropagation();
        },
        cursor: 'pointer',
      };

  const debouncedOnMouseLeave = debounce(onMouseLeave, 1500);

  return (
    <>
      <path
        d={`M0 0 ${pointsInString}`}
        strokeWidth={5}
        stroke={isSelected ? 'white' : '#666'}
        strokeLinecap="round"
        fill="none"
        {...commonProps}
      />
      <path
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
      <path
        d={`M0 0 ${pointsInString}`}
        strokeWidth={10}
        stroke="transparent"
        strokeLinecap="round"
        fill="none"
        {...commonProps}
      />
      {route.path.length > 1 &&
        route.path.map(({ x, y }, index) => {
          if (route?.path && index < route.path.length - 1) {
            return (
              <line
                stroke="transparent"
                strokeWidth={10}
                x1={imageSize.width * x}
                y1={imageSize.height * y}
                x2={imageSize.width * route.path[index + 1].x}
                y2={imageSize.height * route.path[index + 1].y}
                onMouseEnter={onMouseEnter}
                onMouseLeave={debouncedOnMouseLeave}
                onMouseMove={(e) => onMouseMove(e, index)}
                {...commonProps}
              />
            );
          }
          return null;
        })}
      {isSelectedRouteEditable && isHovered && (
        <circle
          cx={tempPointPosition.left}
          cy={tempPointPosition.top}
          onClick={onPointAdd}
          fill="white"
          pointerEvents="all"
          stroke="rgba(0,0,0,0.3)"
          r={7}
          cursor="copy"
        />
      )}
    </>
  );
};
