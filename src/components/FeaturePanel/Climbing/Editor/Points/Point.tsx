import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useClimbingContext } from '../../contexts/ClimbingContext';
import { useConfig } from '../../config';
import { useMobileMode } from '../../../../helpers';
import { usePointClickHandler } from '../utils';
import { PointType } from '../../types';

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
        ? 'transform: scale(1.5);'
        : 'transform: scale(1);'
    }`}
`;

const usePointColor = (type, isHovered) => {
  const config = useConfig();
  const invisiblePointsForTypes = [];

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

type Props = {
  routeIndex: number;
  index: number;
  type: PointType;
  x: number;
  y: number;
};

export const Point = ({ x, y, type, index, routeIndex }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    setPointSelectedIndex,
    setIsPointClicked,
    setRouteIndexHovered,
    photoZoom,
    getCurrentPath,
    setIsPanningDisabled,
    isRouteSelected,
    isPointSelected,
    isOtherRouteSelected,
    isEditMode,
  } = useClimbingContext();
  const isMobileMode = useMobileMode();
  const isSelected = isRouteSelected(routeIndex);
  const isOtherSelected = isOtherRouteSelected(routeIndex);
  const { pointColor, pointStroke } = usePointColor(type, isHovered);

  const isPointOnRouteSelected = isSelected && isPointSelected(index);

  const onPointClick = (e) => {
    e.stopPropagation();
  };

  const onPointMouseEnter = () => {
    setIsHovered(true);
    const isLastPoint = getCurrentPath().length - 1 === index;
    if (!isLastPoint) {
      setRouteIndexHovered(routeIndex);
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

  const onPointMouseUp = usePointClickHandler(index);
  const isTouchDevice = 'ontouchstart' in window;

  const commonProps = {
    onMouseDown: onPointMouseDown,
    onMouseUp: onPointMouseUp,
    onTouchStart: onPointMouseDown,
    onTouchEnd: onPointMouseUp,
    onClick: onPointClick,
    cursor: 'pointer',
    ...(isMobileMode
      ? {}
      : {
          onMouseEnter: onPointMouseEnter,
          onMouseLeave: onPointMouseLeave,
        }),
    cx: 0,
    cy: 0,
  };
  const title = type && <title>{type}</title>;

  if (isOtherSelected && isEditMode)
    return (
      <g transform={`translate(${x},${y}) scale(${1 / photoZoom.scale})`}>
        <circle cx={0} cy={0} r={2.5 * photoZoom.scale} fill="white" />
      </g>
    );
  if (!isSelected || !isEditMode) return null;

  return (
    <g transform={`translate(${x},${y}) scale(${1 / photoZoom.scale})`}>
      <ClickableArea
        fill="transparent"
        r={isTouchDevice ? 16 : 10}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...commonProps}
      >
        {title}
      </ClickableArea>

      <PointElement
        fill={pointColor}
        stroke={pointStroke}
        r={4}
        $isHovered={isHovered}
        $isPointSelected={isPointOnRouteSelected}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...commonProps}
      >
        {title}
      </PointElement>
    </g>
  );
};
