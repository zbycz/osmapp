import React, { useContext } from 'react';
import type { ClimbingRoute } from '../types';
import { ClimbingContext } from '../contexts/climbingContext';
import { Belay } from './BelayPoint';
import { Bolt } from './BoltPoint';
import { Point } from './Point';
import { PulsedPoint } from './PulsedPoint';
import { RoutePath } from './RoutePath';

type Props = {
  route: ClimbingRoute;
  routeNumber: number;
  onRouteSelect: (routeNumber: number) => void;
  onPointClick: (event: React.MouseEvent<any>) => void;
};

export const Route = ({
  route,
  routeNumber,
  onRouteSelect,
  onPointClick,
}: Props) => {
  const { imageSize, routeSelectedIndex, isSelectedRouteEditable } =
    useContext(ClimbingContext);

  const isSelected = routeSelectedIndex === routeNumber;
  const isPointVisible = isSelectedRouteEditable && isSelected;

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
      <RoutePath
        onRouteSelect={onRouteSelect}
        route={route}
        routeNumber={routeNumber}
      />

      {route.path.map(({ x, y, type }, index) => {
        const isBoltVisible = type === 'bolt';
        const isBelayVisible = type === 'belay';

        return (
          <>
            {isPointVisible && <PulsedPoint x={x} y={y} />}
            {isBoltVisible && (
              <Bolt
                x={imageSize.width * x}
                y={imageSize.height * y}
                isSelected={isSelected}
              />
            )}
            {isBelayVisible && (
              <Belay
                x={imageSize.width * x}
                y={imageSize.height * y}
                isSelected={isSelected}
              />
            )}
            {isPointVisible && (
              <Point
                x={x}
                y={y}
                type={type}
                onPointClick={onPointClick}
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
