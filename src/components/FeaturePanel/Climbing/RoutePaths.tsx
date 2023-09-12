import React from 'react';
import styled from 'styled-components';
import { PathPoints } from './types';
import { RouteNumber } from './RouteNumber';
import { RoutePath } from './RoutePath';

const IMAGE_WIDTH = 410;
const IMAGE_HEIGHT = 540;

const Svg = styled.svg<{ isEditable: boolean }>`
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  ${({ isEditable }) => `cursor: ${isEditable ? 'crosshair' : 'auto'}`}
`;

type Props = {
  route: PathPoints;
  routeNumber: number;
  onRouteSelect: (routeNumber: number) => void;
  routeSelected: number;
  isEditable: boolean;
};

const Route = ({
  route,
  routeNumber,
  routeSelected,
  onRouteSelect,
  isEditable,
}: Props) => {
  if (route.length === 0) return null;

  const x = IMAGE_WIDTH * route[0].x;
  const y = IMAGE_HEIGHT * route[0].y;

  if (route.length === 1) {
    return (
      <>
        <circle cx={x} cy={y} r={4} strokeWidth="0" fill="white" />
        <circle cx={x} cy={y} r={2.5} strokeWidth="0" fill="royalblue" />
        <RouteNumber
          onRouteSelect={onRouteSelect}
          x={x}
          y={y}
          routeSelected={routeSelected}
        >
          {routeNumber}
        </RouteNumber>
      </>
    );
  }

  return (
    <>
      <RoutePath
        routeSelected={routeSelected}
        onRouteSelect={onRouteSelect}
        routeNumber={routeNumber}
        route={route}
        isEditable={isEditable}
      />

      <RouteNumber
        onRouteSelect={onRouteSelect}
        x={x}
        y={y}
        routeSelected={routeSelected}
      >
        {routeNumber}
      </RouteNumber>
    </>
  );
};

export const RoutePaths = ({
  data,
  isEditable,
  onClick,
  routeSelected,
  onRouteSelect,
}) => (
  <Svg isEditable={isEditable} onClick={onClick}>
    {data.map((route, index) => (
      <Route
        route={route}
        routeNumber={index}
        routeSelected={routeSelected}
        onRouteSelect={onRouteSelect}
        isEditable={isEditable}
      />
    ))}
  </Svg>
);
