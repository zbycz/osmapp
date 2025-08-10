import React from 'react';
import { RouteNumber } from './RouteNumber';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { Point } from './Points/Point';
import { MouseTrackingLine } from './MouseTrackingLine';
import { useConfig } from '../config';

const NonEditablePoint = ({ x, y, isSelected }) => {
  const config = useConfig();
  return (
    <>
      <circle
        cx={x}
        cy={y}
        r={4}
        strokeWidth="0"
        fill={
          isSelected ? config.pathBorderColorSelected : config.pathBorderColor
        }
      />
      <circle
        cx={x}
        cy={y}
        r={2.5}
        strokeWidth="0"
        fill={
          isSelected ? config.pathStrokeColorSelected : config.pathStrokeColor
        }
      />
    </>
  );
};

type Props = {
  routeIndex: number;
};

export const StartPoint = ({ routeIndex }: Props) => {
  const {
    isRouteSelected,
    machine,
    getPixelPosition,
    getPathForRoute,
    routes,
  } = useClimbingContext();

  const route = routes[routeIndex];
  const path = getPathForRoute(route);
  if (!route || !path || path?.length === 0) return null;

  const { x, y } = getPixelPosition({
    ...path[0],
    units: 'percentage',
  });
  const isSelected = isRouteSelected(routeIndex);

  return (
    <>
      {isSelected &&
      (machine.currentStateName === 'editRoute' ||
        machine.currentStateName === 'extendRoute') ? (
        <Point x={x} y={y} index={0} routeIndex={routeIndex} type={undefined} />
      ) : (
        <NonEditablePoint isSelected={isSelected} x={x} y={y} />
      )}
      <MouseTrackingLine routeIndex={routeIndex} />
      <RouteNumber routeIndex={routeIndex} />
    </>
  );
};
