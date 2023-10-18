/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { updateElementOnIndex } from '../utils';

const ClickableArea = styled.circle`
  // touch-action: none;
`;

const PointElement = styled.circle<{ isHovered: boolean }>`
  transition: all 0.1s ease-in-out;
  touch-action: none;
  ${({ isHovered, isPointSelected }) =>
    `${
      isHovered || isPointSelected
        ? 'transform: scale(1.8);'
        : 'transform: scale(1);'
    }`}
`;

export const Point = ({ x, y, onPointClick, type, index, routeNumber }) => {
  const isBelayVisible = type === 'belay';
  const [isHovered, setIsHovered] = useState(false);
  const {
    setPointSelectedIndex,
    pointSelectedIndex,
    routeSelectedIndex,
    setIsPointMoving,
    setIsPointClicked,
    isPointMoving,
    findClosestPoint,
    routes,
    updateRouteOnIndex,
  } = useClimbingContext();

  const onClick = (e) => {
    e.stopPropagation();
  };

  const onMouseEnter = () => {
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
  };
  const onMouseDown = () => {
    setPointSelectedIndex(index);
    setIsPointClicked(true);
  };

  const onMouseUp = (e) => {
    const currentPoint = routes[routeSelectedIndex].path[pointSelectedIndex];
    const closestPoint = findClosestPoint(currentPoint);
    if (closestPoint) {
      updateRouteOnIndex(routeSelectedIndex, (route) => ({
        ...route,
        path: updateElementOnIndex(
          route.path,
          pointSelectedIndex ?? route.path.length,
          (point) => ({
            ...point,
            x: closestPoint.x,
            y: closestPoint.y,
          }),
        ),
      }));
    }

    setPointSelectedIndex(null);
    if (!isPointMoving) {
      onPointClick(e);
      setPointSelectedIndex(index);
    }
    setIsPointMoving(false);
    setIsPointClicked(false);
    e.stopPropagation();
    e.preventDefault();
    return null;
  };

  const isPointSelected =
    routeSelectedIndex === routeNumber && pointSelectedIndex === index;
  const getPointColor = () => {
    if (isBelayVisible) return 'transparent';
    if (isHovered) return 'white';

    return 'white';
  };
  const pointColor = getPointColor();

  const isTouchDevice = 'ontouchstart' in window;

  const commonProps = {
    onClick,
    cursor: 'pointer',
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onTouchStart: onMouseDown,
    onTouchEnd: onMouseUp,
    cx: 0,
    cy: 0,
  };
  const title = type && <title>{type}</title>;

  return (
    <g transform={`translate(${x},${y})`}>
      <ClickableArea
        fill="transparent"
        r={isTouchDevice ? 20 : 10}
        {...commonProps}
      >
        {title}
      </ClickableArea>

      <PointElement
        fill={pointColor}
        stroke={isHovered ? 'rgba(0,0,0,0.3)' : 'royalblue'}
        r={isTouchDevice ? 5 : 3}
        isHovered={isHovered}
        isPointSelected={isPointSelected}
        {...commonProps}
      >
        {title}
      </PointElement>
    </g>
  );
};
