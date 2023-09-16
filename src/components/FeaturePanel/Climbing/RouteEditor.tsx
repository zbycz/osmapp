import React, { useContext } from 'react';
import styled from 'styled-components';
import type { ClimbingRoute } from './types';
import { RouteNumber } from './RouteNumber';
import { RoutePath } from './RoutePath';
import { ClimbingEditorContext } from './contexts/climbingEditorContext';

const Svg = styled.svg<{
  isEditable: boolean;
  imageSize: { width: number; height: number };
}>`
  position: absolute;
  left: 0;
  top: 0;
  ${({ isEditable }) => `cursor: ${isEditable ? 'crosshair' : 'auto'}`};
  ${({ imageSize: { width, height } }) =>
    `width: ${width}px;
    height:${height}px;`}
`;

type Props = {
  route: ClimbingRoute;
  routeNumber: number;
  onRouteSelect: (routeNumber: number) => void;
};

const Route = ({ route, routeNumber, onRouteSelect }: Props) => {
  if (!route || route.path.length === 0) return null;

  const { imageSize, isSelectedRouteEditable, routeSelectedIndex } = useContext(
    ClimbingEditorContext,
  );

  const x = imageSize.width * route?.path[0].x;
  const y = imageSize.height * route?.path[0].y;

  if (route?.path.length === 1) {
    return (
      <>
        <circle cx={x} cy={y} r={4} strokeWidth="0" fill="white" />
        <circle cx={x} cy={y} r={2.5} strokeWidth="0" fill="royalblue" />
        <RouteNumber
          onRouteSelect={onRouteSelect}
          x={x}
          y={y}
          routeSelectedIndex={routeSelectedIndex}
        >
          {routeNumber}
        </RouteNumber>
      </>
    );
  }

  return (
    <>
      <RoutePath
        routeSelectedIndex={routeSelectedIndex}
        onRouteSelect={onRouteSelect}
        routeNumber={routeNumber}
        route={route}
        isEditable={isSelectedRouteEditable}
      />

      <RouteNumber
        onRouteSelect={onRouteSelect}
        x={x}
        y={y}
        routeSelectedIndex={routeSelectedIndex}
      >
        {routeNumber}
      </RouteNumber>
    </>
  );
};

export const RouteEditor = ({ routes, onClick, onRouteSelect }) => {
  const { imageSize, isSelectedRouteEditable } = useContext(
    ClimbingEditorContext,
  );
  return (
    <Svg
      isEditable={isSelectedRouteEditable}
      onClick={onClick}
      imageSize={imageSize}
    >
      {routes.map((route, index) => (
        <Route
          route={route}
          routeNumber={index}
          onRouteSelect={onRouteSelect}
        />
      ))}
    </Svg>
  );
};
