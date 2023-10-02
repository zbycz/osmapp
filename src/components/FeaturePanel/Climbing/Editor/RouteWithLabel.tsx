import React, { useContext } from 'react';

import { RouteNumber } from './RouteNumber';
import { ClimbingContext } from '../contexts/ClimbingContext';
import { Route } from './Route';
import { ClimbingRoute } from '../types';
import { StartPoint } from './StartPoint';

type Props = {
  route: ClimbingRoute;
  routeNumber: number;
  onRouteSelect: (routeNumber: number) => void;
  onPointClick: (event: React.MouseEvent<any>) => void;
};

export const RouteWithLabel = ({
  route,
  routeNumber,
  onRouteSelect,
  onPointClick,
}: Props) => {
  if (!route || route.path.length === 0) return null;

  const { getPixelPosition } = useContext(ClimbingContext);

  const { x, y } = getPixelPosition(route.path[0]);

  if (route.path.length === 1) {
    return (
      <StartPoint
        x={x}
        y={y}
        onClick={onRouteSelect}
        routeNumber={routeNumber}
      />
    );
  }

  return (
    <>
      <Route
        onRouteSelect={onRouteSelect}
        routeNumber={routeNumber}
        route={route}
        onPointClick={onPointClick}
      />

      <RouteNumber onClick={onRouteSelect} x={x} y={y}>
        {routeNumber}
      </RouteNumber>
    </>
  );
};
