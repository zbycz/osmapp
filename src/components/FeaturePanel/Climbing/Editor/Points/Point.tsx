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
  } = useClimbingContext();
  const isMobileMode = useMobileMode();
  const isPointSelected =
    routeSelectedIndex === routeNumber && pointSelectedIndex === index;
  const onClick = (e) => {
    e.stopPropagation();
  };

  const onMouseEnter = () => {
    setIsHovered(true);
    const isLastPoint = getCurrentPath().length - 1 === index;
    if (!isLastPoint) {
      setRouteIndexHovered(routeNumber);
    }
  };

  const onMouseLeave = () => {
    setIsHovered(false);
    setRouteIndexHovered(null);
  };

  const onMouseDown = (e) => {
    setPointSelectedIndex(index);
    setIsPointClicked(true);
    e.preventDefault();
  };

  const onMouseUp = (e) => {
    // @TODO unify with RouteMarks.tsx
    if (!isPointMoving) {
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

  const { pointColor, pointStroke } = usePointColor(type, isHovered);

  const isTouchDevice = 'ontouchstart' in window;

  const commonProps = {
    onClick,
    cursor: 'pointer',
    ...(isMobileMode ? {} : { onMouseEnter, onMouseLeave }),
    onMouseDown,
    onMouseUp,
    onTouchStart: onMouseDown,
    onTouchEnd: onMouseUp,
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
        r={isTouchDevice ? 5 : 3}
        $isHovered={isHovered}
        $isPointSelected={isPointSelected}
        {...commonProps}
      >
        {title}
      </PointElement>
    </g>
  );
};
