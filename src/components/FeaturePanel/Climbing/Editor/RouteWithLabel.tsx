import React from 'react';

import { RouteNumber } from './RouteNumber';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { ClimbingRoute } from '../types';
import { StartPoint } from './StartPoint';
import { getShiftForStartPoint } from '../utils/startPoint';
import { RoutePath } from './RoutePath';
import { getShortId } from '../../../../services/helpers';

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
  const { getPixelPosition, getPathForRoute, routes, photoPath, photoZoom } =
    useClimbingContext();
  const path = getPathForRoute(route);
  if (!route || !path || path?.length === 0) return null;

  const shift =
    getShiftForStartPoint({
      currentRouteSelectedIndex: routeNumber,
      currentPosition: path[0],
      checkedRoutes: routes,
      photoPath,
    }) / photoZoom.scale;

  const { x, y } = getPixelPosition({
    ...path[0],
    units: 'percentage',
  });
  const osmId = route.feature?.osmMeta
    ? getShortId(route.feature.osmMeta)
    : null;

  if (path.length === 1) {
    return (
      <StartPoint
        onPointInSelectedRouteClick={onPointInSelectedRouteClick}
        x={x}
        y={y}
        routeNumberXShift={shift}
        routeNumber={routeNumber}
        osmId={osmId}
      />
    );
  }

  return (
    <>
      <defs>
        <marker
          id="triangle"
          viewBox="0 0 15 15"
          refX="30"
          refY="5"
          markerUnits="strokeWidth"
          orient="auto"
        >
          <path
            d="M 0 0 L 10 5 L 0 10"
            stroke="white"
            strokeWidth={5}
            fill="none"
          />
          <path
            d="M 0 0 L 10 5 L 0 10"
            stroke="black"
            strokeWidth={3}
            fill="none"
          />
        </marker>
      </defs>

      <RoutePath route={route} routeNumber={routeNumber} />
      <RouteNumber x={x + shift} y={y} osmId={osmId}>
        {routeNumber}
      </RouteNumber>
    </>
  );
};
