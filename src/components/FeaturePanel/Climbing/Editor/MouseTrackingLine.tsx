import React from 'react';
import { PathWithBorder } from './PathWithBorder';
import { useClimbingContext } from '../contexts/ClimbingContext';

type Props = {
  routeIndex: number;
};

export const MouseTrackingLine = ({ routeIndex }: Props) => {
  const {
    mousePosition,
    isRouteSelected,
    getPixelPosition,
    getPercentagePosition,
    routes,
    findCloserPoint,
    getPathForRoute,
  } = useClimbingContext();

  const route = routes[routeIndex];
  const path = getPathForRoute(route);
  const lastPoint = path[path.length - 1];
  const lastPointPositionInPx = getPixelPosition(lastPoint);

  const closerMousePositionPoint = mousePosition
    ? findCloserPoint(getPercentagePosition(mousePosition))
    : null;
  const mousePositionSticked = closerMousePositionPoint
    ? getPixelPosition(closerMousePositionPoint)
    : mousePosition;

  const isSelected = isRouteSelected(routeIndex);

  return (
    mousePositionSticked &&
    isSelected && (
      <PathWithBorder
        d={`M ${lastPointPositionInPx.x} ${lastPointPositionInPx.y} L ${mousePositionSticked.x} ${mousePositionSticked.y}`}
        routeIndex={routeIndex}
        opacity={0.7}
      />
    )
  );
};
