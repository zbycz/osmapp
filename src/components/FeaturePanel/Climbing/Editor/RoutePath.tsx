import React from 'react';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { PathWithBorder } from './PathWithBorder';
import { MouseTrackingLine } from './MouseTrackingLine';
import { InteractivePath } from './InteractivePath';

type Props = {
  routeIndex: number;
};

export const RoutePath = ({ routeIndex }: Props) => {
  const {
    getPixelPosition,
    machine,
    routeIndexHovered,
    getPathForRoute,
    routes,
  } = useClimbingContext();
  const route = routes[routeIndex];
  const path = getPathForRoute(route);

  if (!path) {
    return null;
  }

  const pointsInString = path
    .map(({ x, y }, index) => {
      const position = getPixelPosition({ x, y, units: 'percentage' });
      return `${index === 0 ? 'M' : 'L'}${position.x} ${position.y}`;
    })
    .join(' ');

  return (
    <>
      <PathWithBorder d={pointsInString} routeIndex={routeIndex} />
      {machine.currentStateName === 'extendRoute' &&
        routeIndexHovered === null && (
          <MouseTrackingLine routeIndex={routeIndex} />
        )}
    </>
  );
};
