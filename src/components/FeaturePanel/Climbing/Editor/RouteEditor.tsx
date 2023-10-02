import React, { useContext } from 'react';
import styled from 'styled-components';

import { ClimbingContext } from '../contexts/ClimbingContext';
import { PointMenu } from './PointMenu';
import { RouteWithLabel } from './RouteWithLabel';

const Svg = styled.svg<{
  hasEditableCursor: boolean;
  imageSize: { width: number; height: number };
}>`
  position: absolute;
  left: 0;
  top: 0;
  ${({ hasEditableCursor }) =>
    `cursor: ${hasEditableCursor ? 'crosshair' : 'auto'}`};
  ${({ imageSize: { width, height } }) =>
    `width: ${width}px;
    height:${height}px;`}
`;

// @TODO rename onFinishClimbingRouteClick?
export const RouteEditor = ({
  routes,
  onClick,
  onRouteSelect,
  onFinishClimbingRouteClick,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); // @TODO rename

  const {
    imageSize,
    isSelectedRouteEditable,
    pointSelectedIndex,
    routeSelectedIndex,
  } = useContext(ClimbingContext);

  // @TODO rename? on point in selected route clicked
  const onPointClick = (event: React.MouseEvent<HTMLElement>) => {
    const isDoubleClick = event.detail === 2;
    const lastPointIndex = routes[routeSelectedIndex].path.length - 1;

    if (isDoubleClick && pointSelectedIndex === lastPointIndex) {
      onFinishClimbingRouteClick();
      return;
    }

    setAnchorEl(anchorEl !== null ? null : event.currentTarget);
  };

  return (
    <>
      <Svg
        hasEditableCursor={isSelectedRouteEditable}
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
