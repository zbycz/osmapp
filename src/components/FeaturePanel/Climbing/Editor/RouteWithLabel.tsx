import React from 'react';

import { RouteNumber } from './RouteNumber';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { Route } from './Route';
import { ClimbingRoute } from '../types';
import { StartPoint } from './StartPoint';

type Props = {
  route: ClimbingRoute;
  routeNumber: number;
  onPointInSelectedRouteClick: (event: React.MouseEvent<any>) => void;
};

export const RouteWithLabel = ({
  route,
  routeNumber,
  onPointInSelectedRouteClick,
}: Props) => {
  const { getPixelPosition, getPathForRoute } = useClimbingContext();
  const path = getPathForRoute(route);
  if (!route || !path || path?.length === 0) return null;

  const { x, y } = getPixelPosition({
    ...path[0],
    units: 'percentage',
  });

  if (path.length === 1) {
    return (
      <StartPoint
        onPointInSelectedRouteClick={onPointInSelectedRouteClick}
        x={x}
        y={y}
        routeNumber={routeNumber}
      />
    );
  }

  return (
    <>
      <Route
        routeNumber={routeNumber}
        route={route}
        onPointInSelectedRouteClick={onPointInSelectedRouteClick}
      />

      <RouteNumber x={x} y={y}>
        {routeNumber}
      </RouteNumber>
    </>
  );
};
