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
  routeSelectedIndex: number;
  isEditable: boolean;
};

const Route = ({
  route,
  routeNumber,
  routeSelectedIndex,
  onRouteSelect,
  isEditable,
}: Props) => {
  if (!route || route.path.length === 0) return null;

  const { imageSize } = useContext(ClimbingEditorContext);
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
        isEditable={isEditable}
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

export const RouteEditor = ({
  routes,
  isEditable,
  onClick,
  routeSelectedIndex,
  onRouteSelect,
}) => {
  const { imageSize } = useContext(ClimbingEditorContext);
  return (
    <Svg isEditable={isEditable} onClick={onClick} imageSize={imageSize}>
      {routes.map((route, index) => (
        <Route
          route={route}
          routeNumber={index}
          routeSelectedIndex={routeSelectedIndex}
          onRouteSelect={onRouteSelect}
          isEditable={isEditable}
        />
      ))}
    </Svg>
  );
};
