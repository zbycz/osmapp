import React from 'react';

import { RouteNumber } from './RouteNumber';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { StartPoint } from './StartPoint';
import { RoutePath } from './RoutePath';

type Props = {
  routeIndex: number;
};

export const RouteWithLabel = ({ routeIndex }: Props) => {
  const { getPathForRoute, routes } = useClimbingContext();

  const route = routes[routeIndex];
  const path = getPathForRoute(route);
  if (!route || !path || path?.length === 0) return null;

  if (path.length === 1) {
    return <StartPoint routeIndex={routeIndex} />; // TODO move the <NonEditablePoint> to RoutePath later
  }

  return (
    <>
      <RoutePath routeIndex={routeIndex} />
      <RouteNumber routeIndex={routeIndex} />
    </>
  );
};
