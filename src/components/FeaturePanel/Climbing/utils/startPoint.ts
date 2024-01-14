import { Position, ClimbingRoute } from '../types';

const SHIFT_WIDTH = 15;

export const getShiftForStartPoint = ({
  currentPosition: { x, y },
  currentRouteSelectedIndex,
  checkedRoutes,
  photoPath,
}: {
  currentPosition: Position;
  checkedRoutes: Array<ClimbingRoute>;
  currentRouteSelectedIndex: number;
  photoPath: string;
}) =>
  checkedRoutes.reduce((shift, route, index) => {
    const firstPoint: Position = route?.paths?.[photoPath]?.[0] ?? null;
    if (
      firstPoint &&
      x === firstPoint.x &&
      y === firstPoint.y &&
      index < currentRouteSelectedIndex
    ) {
      return shift + SHIFT_WIDTH;
    }
    return shift;
  }, 0);
