import React from 'react';

import { RouteNumber } from './RouteNumber';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { Route } from './Route';
import { ClimbingRoute } from '../types';
import { StartPoint } from './StartPoint';
import { getShiftForStartPoint } from '../utils/startPoint';

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
  const { getPixelPosition, getPathForRoute, routes, photoPath } =
    useClimbingContext();
  const path = getPathForRoute(route);
  if (!route || !path || path?.length === 0) return null;

  const shift = getShiftForStartPoint({
    currentRouteSelectedIndex: routeNumber,
    currentPosition: path[0],
    checkedRoutes: routes,
    photoPath,
  });

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
        routeNumberXShift={100}
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

      <RouteNumber x={x + shift} y={y}>
        {routeNumber}
      </RouteNumber>
    </>
  );
};
