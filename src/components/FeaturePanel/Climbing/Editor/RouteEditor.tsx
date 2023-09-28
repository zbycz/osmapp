import React, { useContext } from 'react';
import styled from 'styled-components';

import type { ClimbingRoute } from '../types';
import { RouteNumber } from './RouteNumber';
import { ClimbingContext } from '../contexts/climbingContext';
import { Route } from './Route';
import { PointMenu } from './PointMenu';

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
  onPointClick: (event: React.MouseEvent<any>) => void;
};

const RouteWithLabel = ({
  route,
  routeNumber,
  onRouteSelect,
  onPointClick,
}: Props) => {
  if (!route || route.path.length === 0) return null;

  const { imageSize, routeSelectedIndex } = useContext(ClimbingContext);
  const isSelected = routeSelectedIndex === routeNumber;
  const x = imageSize.width * route?.path[0].x;
  const y = imageSize.height * route?.path[0].y;

  if (route?.path.length === 1) {
    return (
      <>
        <circle
          cx={x}
          cy={y}
          r={4}
          strokeWidth="0"
          fill={isSelected ? 'white' : '#666'}
        />
        <circle
          cx={x}
          cy={y}
          r={2.5}
          strokeWidth="0"
          fill={isSelected ? 'royalblue' : 'white'}
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
  }

  return (
    <>
      <Route
        onRouteSelect={onRouteSelect}
        routeNumber={routeNumber}
        route={route}
        onPointClick={onPointClick}
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
  onClick,
  onRouteSelect,
  onFinishClimbingRouteClick,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const {
    imageSize,
    isSelectedRouteEditable,
    pointSelectedIndex,
    routeSelectedIndex,
  } = useContext(ClimbingContext);

  const onPointClick = (event: React.MouseEvent<HTMLElement>) => {
    const isDoubleClick = event.detail === 2;
    if (pointSelectedIndex === routes[routeSelectedIndex].path.length - 1) {
      if (isDoubleClick) {
        onFinishClimbingRouteClick();
        return;
      }
    }

    setAnchorEl(anchorEl !== null ? null : event.currentTarget);
  };

  return (
    <>
      <Svg
        isEditable={isSelectedRouteEditable}
        onClick={(e) => {
          onClick(e);
        }}
        imageSize={imageSize}
      >
        {routes.map((route, index) => (
          <RouteWithLabel
            route={route}
            routeNumber={index}
            onRouteSelect={onRouteSelect}
            onPointClick={onPointClick}
          />
        ))}
      </Svg>

      <PointMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        onFinishClimbingRouteClick={onFinishClimbingRouteClick}
      />
    </>
  );
};
