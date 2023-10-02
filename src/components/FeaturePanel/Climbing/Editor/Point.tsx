/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ClimbingContext } from '../contexts/climbingContext';
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
  const [wasMoved, setWasMoved] = useState(false);
  const {
    setPointSelectedIndex,
    pointSelectedIndex,
    routeSelectedIndex,
    updateRouteOnIndex,
    editorPosition,
    setIsPointMoving,
    isPointMoving,
    getPercentagePosition,
  } = useContext(ClimbingContext);

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
    setIsPointMoving(true);
  };

  const onMouseUp = (e) => {
    setPointSelectedIndex(null);
    setIsPointMoving(false);

    if (!wasMoved) {
      onPointClick(e);
      setPointSelectedIndex(index);
    }
    setWasMoved(false);
    e.stopPropagation();
    e.preventDefault();
    return null;
  };

  const onMove = (position: { x: number; y: number }) => {
    if (isPointMoving) {
      setWasMoved(true);
      const newCoordinate = getPercentagePosition({
        x: position.x - editorPosition.x,
        y: position.y - editorPosition.y,
      });
      updateRouteOnIndex(routeSelectedIndex, (route) => ({
        ...route,
        path: updateElementOnIndex(route.path, pointSelectedIndex, (point) => ({
          ...point,
          x: newCoordinate.x,
          y: newCoordinate.y,
        })),
      }));
    }
  };

  const onTouchMove = (e) => {
    onMove({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const onMouseMove = (e) => {
    console.log('___onMouseMove');

    onMove({ x: e.clientX, y: e.clientY });
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
    onMouseMove,
    onTouchStart: onMouseDown,
    onTouchEnd: onMouseUp,
    onTouchMove,
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
