/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useClimbingContext } from '../../contexts/ClimbingContext';
import { useConfig } from '../../config';
import { useMobileMode } from '../../../../helpers';

const ClickableArea = styled.circle``;

const PointElement = styled.circle<{
  $isHovered: boolean;
  $isPointSelected: boolean;
}>`
  transition: all 0.1s ease-in-out;
  pointer-events: all;
  touch-action: none;
  ${({ $isHovered, $isPointSelected }) =>
    `${
      $isHovered || $isPointSelected
        ? 'transform: scale(1.8);'
        : 'transform: scale(1);'
    }`}
`;

const usePointColor = (type, isHovered) => {
  const config = useConfig();
  const invisiblePointsForTypes = ['bolt', 'piton', 'unfinished'];

  if (invisiblePointsForTypes.includes(type))
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
    setRouteIndexHovered,
    photoZoom,
    getCurrentPath,
    setIsPanningDisabled,
    isPanningDisabled,
  } = useClimbingContext();
  const isMobileMode = useMobileMode();
  const isPointSelected =
    routeSelectedIndex === routeNumber && pointSelectedIndex === index;
  const onPointClick = (e) => {
    e.stopPropagation();
  };

  const onPointMouseEnter = () => {
    setIsHovered(true);
    const isLastPoint = getCurrentPath().length - 1 === index;
    if (!isLastPoint) {
      setRouteIndexHovered(routeNumber);
    }
  };

  const onPointMouseLeave = () => {
    setIsHovered(false);
    setRouteIndexHovered(null);
  };

  const onPointMouseDown = (e) => {
    setIsPanningDisabled(true);
    setPointSelectedIndex(index);
    setIsPointClicked(true);
    e.stopPropagation();
  };

  const onPointMouseUp = (e) => {
    // @TODO unify with RouteMarks.tsx
    if (!isPointMoving) {
      onPointInSelectedRouteClick(e);
      setPointElement(pointElement !== null ? null : e.currentTarget);
      setPointSelectedIndex(index);
      setIsPointMoving(false);
      setIsPointClicked(false);
      e.stopPropagation();
      e.preventDefault();
    }
  };
  const { pointColor, pointStroke } = usePointColor(type, isHovered);

  const isTouchDevice = 'ontouchstart' in window;

  const commonProps = {
    onClick: onPointClick,
    cursor: 'pointer',
    ...(isMobileMode
      ? {}
      : { onMouseEnter: onPointMouseEnter, onMouseLeave: onPointMouseLeave }),
    onMouseDown: onPointMouseDown,
    onMouseUp: onPointMouseUp,
    onTouchStart: onPointMouseDown,
    onTouchEnd: onPointMouseUp,
    cx: 0,
    cy: 0,
  };
  const title = type && <title>{type}</title>;

  return (
    <g transform={`translate(${x},${y}) scale(${1 / photoZoom.scale})`}>
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
        r={isTouchDevice ? 7 : 4}
        $isHovered={isHovered}
        $isPointSelected={isPointSelected}
        {...commonProps}
      >
        {title}
      </PointElement>
    </g>
  );
};
