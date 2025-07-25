import React from 'react';

import { RouteNumber } from './RouteNumber';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { ClimbingRoute } from '../types';
import { StartPoint } from './StartPoint';
import { getShiftForStartPoint } from '../utils/startPoint';
import { RoutePath } from './RoutePath';
import { getShortId } from '../../../../services/helpers';
import { RouteDifficulty } from './RouteDifficulty';
import { useUserSettingsContext } from '../../../utils/UserSettingsContext';

type Props = {
  route: ClimbingRoute;
  routeNumber: number;
};

export const RouteWithLabel = ({ route, routeNumber }: Props) => {
  const { getPixelPosition, getPathForRoute, routes, photoPath, photoZoom } =
    useClimbingContext();
  const { userSettings } = useUserSettingsContext();
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
      <RoutePath route={route} routeNumber={routeNumber} />
      <RouteNumber x={x + shift} y={y} osmId={osmId}>
        {routeNumber}
      </RouteNumber>
      {userSettings['climbing.isGradesOnPhotosVisible'] && (
        <RouteDifficulty x={x + shift} y={y + 40} route={route} />
      )}
    </>
  );
};
