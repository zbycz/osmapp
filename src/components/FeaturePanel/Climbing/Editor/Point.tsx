/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useClimbingContext } from '../contexts/ClimbingContext';

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

const getPointColor = (type, isHovered) => {
  if (type) return { pointColor: 'transparent', pointStroke: 'transparent' };
  if (isHovered) return { pointColor: 'white', pointStroke: 'rgba(0,0,0,0.3)' };

  return { pointColor: 'white', pointStroke: 'royalblue' };
};

export const Point = ({
  x,
  y,
  onPointInSelectedRouteClick,
  type,
  index,
  routeNumber,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    setPointSelectedIndex,
    pointSelectedIndex,
    routeSelectedIndex,
    setIsPointMoving,
    setIsPointClicked,
    isPointMoving,
    pointElement,
    setPointElement,
    setIsLineInteractiveAreaHovered,
  } = useClimbingContext();

  const onClick = (e) => {
    e.stopPropagation();
  };

  const onMouseEnter = () => {
    setIsHovered(true);
    setIsLineInteractiveAreaHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
    setIsLineInteractiveAreaHovered(false);
  };
  const onMouseDown = () => {
    setPointSelectedIndex(index);
    setIsPointClicked(true);
  };

  const onMouseUp = (e) => {
    setPointSelectedIndex(null);
    if (!isPointMoving) {
      onPointInSelectedRouteClick(e);
      setPointElement(pointElement !== null ? null : e.currentTarget);
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
  const { pointColor, pointStroke } = getPointColor(type, isHovered);

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
        stroke={pointStroke}
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
