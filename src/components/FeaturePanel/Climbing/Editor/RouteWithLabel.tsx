import React, { useContext } from 'react';

import { RouteNumber } from './RouteNumber';
import { ClimbingContext } from '../contexts/climbingContext';
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

  const { imageSize, routeSelectedIndex } = useContext(ClimbingContext);

  const x = imageSize.width * route.path[0].x; // @TODO do contextu, rename x?
  const y = imageSize.height * route.path[0].y; // @TODO do contextu

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

      <RouteNumber
        onClick={onRouteSelect}
        x={x}
        y={y}
        routeSelectedIndex={routeSelectedIndex}
      >
        {routeNumber}
      </RouteNumber>
    </>
  );
};
