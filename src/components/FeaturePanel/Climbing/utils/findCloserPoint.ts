import { Position } from '../types';

const getCloserPoint = ({
  to,
  point1,
  point2,
}: {
  to: Position;
  point1: Position;
  point2: Position;
}) => {
  const distanceTo1 = Math.sqrt(point1.x - to.x ** 2 + point1.y - to.y ** 2);
  const distanceTo2 = Math.sqrt(point2.x - to.x ** 2 + point2.y - to.y ** 2);

  if (distanceTo1 < distanceTo2) {
    return point1;
  }
  return point2;
};

export const findCloserPointFactory =
  ({ routeSelectedIndex, routes, getPathForRoute }) =>
  (checkedPosition: Position) => {
    // dát jinam
    if (routeSelectedIndex === null || !checkedPosition.x || !checkedPosition.y)
      return null;

    const STICKY_THRESHOLD = 0.015;

    return routes
      .map((route, index) => {
        const isCurrentRoute = index === routeSelectedIndex;
        if (isCurrentRoute) return [];
        return getPathForRoute(route);
      })
      .flat()
      .reduce((closestPoint, point) => {
        if (!point) return closestPoint;
        const isPointNearby =
          checkedPosition.x - STICKY_THRESHOLD < point.x &&
          checkedPosition.x + STICKY_THRESHOLD > point.x &&
          checkedPosition.y - STICKY_THRESHOLD < point.y &&
          checkedPosition.y + STICKY_THRESHOLD > point.y;

        if (isPointNearby) {
          if (closestPoint) {
            return getCloserPoint({
              to: checkedPosition,
              point1: closestPoint,
              point2: point,
            });
          }
          return point;
        }
        return closestPoint;
      }, null);
  };
