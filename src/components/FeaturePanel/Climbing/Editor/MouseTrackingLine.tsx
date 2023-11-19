import React from 'react';
import { PathWithBorder } from './PathWithBorder';
import { useClimbingContext } from '../contexts/ClimbingContext';

export const MouseTrackingLine = ({ routeNumber }) => {
  const {
    mousePosition,
    isRouteSelected,
    getPixelPosition,
    routes,
    editorPosition,
  } = useClimbingContext();

  const route = routes[routeNumber];
  const lastPointPositionInPx = getPixelPosition(
    route.path[route.path.length - 1],
  );

  const isSelected = isRouteSelected(routeNumber);
  return (
    mousePosition &&
    isSelected && (
      <PathWithBorder
        d={`M ${lastPointPositionInPx.x} ${lastPointPositionInPx.y} L ${
          mousePosition.x - editorPosition.x
        } ${mousePosition.y - editorPosition.y}`}
        isSelected={isSelected}
        pointerEvents="none"
        opacity={0.4}
        // markerEnd={isSelected ? 'url(#triangle)' : null}
      />
    )
  );
};
