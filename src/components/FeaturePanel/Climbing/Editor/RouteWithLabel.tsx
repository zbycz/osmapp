import React from 'react';

import { RouteNumber } from './RouteNumber';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { Route } from './Route';
import { ClimbingRoute } from '../types';
import { StartPoint } from './StartPoint';

type Props = {
  route: ClimbingRoute;
  routeNumber: number;
  onPointClick: (event: React.MouseEvent<any>) => void;
};

export const RouteWithLabel = ({ route, routeNumber, onPointClick }: Props) => {
  if (!route || route.path.length === 0) return null;

  const { getPixelPosition } = useClimbingContext();

  const { x, y } = getPixelPosition(route.path[0]);

  if (route.path.length === 1) {
    return (
      <StartPoint
        onPointClick={onPointClick}
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
        onPointClick={onPointClick}
      />

      <RouteNumber x={x} y={y}>
        {routeNumber}
      </RouteNumber>
    </>
  );
};
