import React from 'react';
import type { ClimbingRoute } from '../types';
import { Belay } from './BelayPoint';
import { Bolt } from './BoltPoint';
import { Point } from './Point';
import { PulsedPoint } from './PulsedPoint';
import { RoutePath } from './RoutePath';
import { useClimbingContext } from '../contexts/ClimbingContext';

type Props = {
  route: ClimbingRoute;
  routeNumber: number;
  onPointInSelectedRouteClick: (event: React.MouseEvent<any>) => void;
};

export const Route = ({
  route,
  routeNumber,
  onPointInSelectedRouteClick,
}: Props) => {
  const { getPixelPosition, isRouteSelected, getMachine, isPointSelected } =
    useClimbingContext();

  const machine = getMachine();
  const isSelected = isRouteSelected(routeNumber);
  const isThisRouteEditOrExtendMode =
    (machine.currentStateName === 'extendRoute' ||
      machine.currentStateName === 'pointMenu' ||
      machine.currentStateName === 'editRoute') &&
    isSelected;
  // move defs
  return (
    <>
      <defs>
        <marker
          id="triangle"
          viewBox="0 0 10 10"
          refX="-5"
          refY="5"
          markerUnits="strokeWidth"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
        </marker>
      </defs>
      <RoutePath route={route} routeNumber={routeNumber} />

      {route.path.map(({ x, y, type }, index) => {
        const isBoltVisible = type === 'bolt';
        const isBelayVisible = type === 'belay';
        const position = getPixelPosition({ x, y, units: 'percentage' });
        const isActualPointSelected = isSelected && isPointSelected(index);

        return (
          <>
            {isThisRouteEditOrExtendMode && <PulsedPoint x={x} y={y} />}
            {isBoltVisible && (
              <Bolt
                x={position.x}
                y={position.y}
                isPointSelected={isActualPointSelected}
              />
            )}
            {isBelayVisible && (
              <Belay
                x={position.x}
                y={position.y}
                isPointSelected={isActualPointSelected}
              />
            )}
            {isThisRouteEditOrExtendMode && (
              <Point
                x={position.x}
                y={position.y}
                type={type}
                onPointInSelectedRouteClick={onPointInSelectedRouteClick}
                index={index}
                routeNumber={routeNumber}
              />
            )}
          </>
        );
      })}
    </>
  );
};
