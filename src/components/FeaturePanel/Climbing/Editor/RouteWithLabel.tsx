import React from 'react';

import { RouteNumber } from './RouteNumber';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { StartPoint } from './StartPoint';
import { getShiftForStartPoint } from '../utils/startPoint';
import { RoutePath } from './RoutePath';
import { getShortId } from '../../../../services/helpers';
import { RouteDifficulty } from './RouteDifficulty';
import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';

type Props = {
  routeIndex: number;
};

export const RouteWithLabel = ({ routeIndex }: Props) => {
  const { getPixelPosition, getPathForRoute, routes, photoPath, photoZoom } =
    useClimbingContext();
  const { userSettings } = useUserSettingsContext();

  const route = routes[routeIndex];
  const path = getPathForRoute(route);
  if (!route || !path || path?.length === 0) return null;

  const shift =
    getShiftForStartPoint({
      currentRouteSelectedIndex: routeIndex,
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
        routeNumber={routeIndex}
        osmId={osmId}
      />
    );
  }

  return (
    <>
      <RoutePath routeIndex={routeIndex} />
      <RouteNumber x={x + shift} y={y} osmId={osmId}>
        {routeIndex}
      </RouteNumber>
      {userSettings['climbing.isGradesOnPhotosVisible'] && (
        <RouteDifficulty x={x + shift} y={y + 40} route={route} />
      )}
    </>
  );
};
