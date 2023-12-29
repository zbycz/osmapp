import React from 'react';
import type { ClimbingRoute } from '../types';
import { Anchor } from './Points/Anchor';
import { Bolt } from './Points/Bolt';
import { Point } from './Points/Point';
import { PulsedPoint } from './Points/PulsedPoint';
import { RoutePath } from './RoutePath';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { Sling } from './Points/Sling';
import { Piton } from './Points/Piton';

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
  const {
    getPixelPosition,
    isRouteSelected,
    getMachine,
    isPointSelected,
    getPathForRoute,
  } = useClimbingContext();

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

      {getPathForRoute(route).map(({ x, y, type }, index) => {
        const isBoltVisible = type === 'bolt';
        const isAnchorVisible = type === 'anchor';
        const isSlingVisible = type === 'sling';
        const isPitonVisible = type === 'piton';
        const position = getPixelPosition({ x, y, units: 'percentage' });
        const isActualPointSelected = isSelected && isPointSelected(index);
        const pointerEvents = isSelected ? 'auto' : 'none';
        return (
          <>
            {isThisRouteEditOrExtendMode && <PulsedPoint x={x} y={y} />}
            {isBoltVisible && (
              <Bolt
                x={position.x}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
              />
            )}
            {isPitonVisible && (
              <Piton
                x={position.x}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
              />
            )}
            {isSlingVisible && (
              <Sling
                x={position.x}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
              />
            )}
            {isAnchorVisible && (
              <Anchor
                x={position.x}
                y={position.y}
                isPointSelected={isActualPointSelected}
                pointerEvents={pointerEvents}
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
