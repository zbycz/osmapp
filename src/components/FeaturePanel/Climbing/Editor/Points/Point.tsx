/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useClimbingContext } from '../../contexts/ClimbingContext';
import { useConfig } from '../../config';

const ClickableArea = styled.circle`
  // touch-action: none;
`;

const PointElement = styled.circle<{ isHovered: boolean }>`
  transition: all 0.1s ease-in-out;
  pointer-events: all;
  touch-action: none;
  ${({ isHovered, isPointSelected }) =>
    `${
      isHovered || isPointSelected
        ? 'transform: scale(1.8);'
        : 'transform: scale(1);'
    }`}
`;

const usePointColor = (type, isHovered) => {
  const config = useConfig();

  if (type === 'bolt' || type === 'piton')
    return { pointColor: 'transparent', pointStroke: 'transparent' };
  if (isHovered)
    return {
      pointColor: config.pathBorderColor,
      pointStroke: config.pathBorderColorSelected,
    };

  return {
    pointColor: config.pathBorderColor,
    pointStroke: config.pathBorderColorSelected,
  };
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
    imageZoom,
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
    console.log('____onMouseDown');
    setPointSelectedIndex(index);
    setIsPointClicked(true);
  };

  const onMouseUp = (e) => {
    console.log('____onMouseUp');
    // @TODO unify with RouteMarks.tsx
    if (!isPointMoving) {
      console.log('________onMouseUp');
      setPointSelectedIndex(null);
      onPointInSelectedRouteClick(e);
      setPointElement(pointElement !== null ? null : e.currentTarget);
      setPointSelectedIndex(index);
      setIsPointMoving(false);
      setIsPointClicked(false);
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const onTouchMove = () => {
    // setIsPointMoving(true);
    // console.log('___MOVE', isPointMoving);
  };

  const isPointSelected =
    routeSelectedIndex === routeNumber && pointSelectedIndex === index;
  const { pointColor, pointStroke } = usePointColor(type, isHovered);

  const isTouchDevice = 'ontouchstart' in window;

  const commonProps = {
    onClick,
    cursor: 'pointer',
    onMouseEnter,
    onMouseLeave,

    onMouseDown,
    onTouchMove,
    onPointerMove: onTouchMove,
    onMouseUp,
    onTouchStart: onMouseDown,
    onTouchEnd: onMouseUp,
    cx: 0,
    cy: 0,
  };
  const title = type && <title>{type}</title>;

  return (
    <g transform={`translate(${x},${y}) scale(${1 / imageZoom.scale})`}>
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
