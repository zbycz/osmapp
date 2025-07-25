import React from 'react';
import { PathWithBorder } from './PathWithBorder';
import { useClimbingContext } from '../contexts/ClimbingContext';

export const MouseTrackingLine = ({ routeNumber }) => {
  const {
    mousePosition,
    isRouteSelected,
    getPixelPosition,
    getPercentagePosition,
    routes,
    findCloserPoint,
    getPathForRoute,
  } = useClimbingContext();

  const route = routes[routeNumber];
  const path = getPathForRoute(route);
  const lastPoint = path[path.length - 1];
  const lastPointPositionInPx = getPixelPosition(lastPoint);

  const closerMousePositionPoint = mousePosition
    ? findCloserPoint(getPercentagePosition(mousePosition))
    : null;
  const mousePositionSticked = closerMousePositionPoint
    ? getPixelPosition(closerMousePositionPoint)
    : mousePosition;

  const isSelected = isRouteSelected(routeNumber);

  return (
    mousePositionSticked &&
    isSelected && (
      <PathWithBorder
        d={`M ${lastPointPositionInPx.x} ${lastPointPositionInPx.y} L ${mousePositionSticked.x} ${mousePositionSticked.y}`}
        routeNumber={routeNumber}
        isSelected={isSelected}
        route={route}
        pointerEvents="none"
        opacity={0.7}
      />
    )
  );
};
