import React from 'react';
import styled from 'styled-components';

import { useClimbingContext } from '../contexts/ClimbingContext';
import { PointMenu } from './PointMenu';
import { RouteWithLabel } from './RouteWithLabel';
import { RouteFloatingMenu } from './RouteFloatingMenu';
import { Position } from '../types';

const Svg = styled.svg<{
  hasEditableCursor: boolean;
  imageSize: { width: number; height: number };
}>`
  position: absolute;
  /* left: 0; */
  top: 0;
  ${({ hasEditableCursor }) =>
    `cursor: ${hasEditableCursor ? 'crosshair' : 'auto'}`};
  ${({ imageSize: { width, height } }) =>
    `width: ${width}px;
    height:${height}px;
    height: 100%;
    `}
`;

const RouteFloatingMenuContainer = styled.div<{ position: Position }>`
  position: absolute;
  left: ${({ position }) => position.x}px;
  top: ${({ position }) => position.y}px;
`;

// @TODO rename onFinishClimbingRouteClick?
export const RouteEditor = ({
  routes,
  onClick,
  onEditorMouseMove,
  onEditorTouchMove,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); // @TODO rename

  const {
    imageSize,
    pointSelectedIndex,
    routeSelectedIndex,
    useMachine,
    isRouteSelected,
    getPixelPosition,
    editorPosition,
    scrollOffset,
  } = useClimbingContext();

  // @TODO rename? on point in selected route clicked
  const machine = useMachine();
  const onPointClick = (event: React.MouseEvent<HTMLElement>) => {
    machine.execute('showPointMenu');
    const isDoubleClick = event.detail === 2;
    const lastPointIndex = routes[routeSelectedIndex].path.length - 1;

    if (isDoubleClick && pointSelectedIndex === lastPointIndex) {
      machine.execute('finishRoute');
      return;
    }

    setAnchorEl(anchorEl !== null ? null : event.currentTarget);
  };

  const sortedRoutes = routes.reduce(
    (acc, route, index) => {
      const RenderRoute = () => (
        <RouteWithLabel
          route={route}
          routeNumber={index}
          onPointClick={onPointClick}
        />
      );

      if (isRouteSelected(index)) {
        return {
          ...acc,
          selected: [...acc.selected, <RenderRoute />],
        };
      }
      return { ...acc, rest: [...acc.rest, <RenderRoute />] };
    },
    { selected: [], rest: [] },
  );

  const lastPointOfSelectedRoute =
    routeSelectedIndex !== null && routes[routeSelectedIndex].path.length > 0
      ? getPixelPosition(
          routes[routeSelectedIndex].path[
            routes[routeSelectedIndex].path.length - 1
          ],
        )
      : null;

  return (
    <>
      <Svg
        hasEditableCursor={machine.currentStateName === 'extendRoute'}
        onClick={(e) => {
          onClick(e);
        }}
        onMouseMove={onEditorMouseMove}
        onTouchMove={onEditorTouchMove}
        imageSize={imageSize}
      >
        {sortedRoutes.rest}
        {sortedRoutes.selected}
      </Svg>

      <PointMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      {lastPointOfSelectedRoute && (
        <RouteFloatingMenuContainer
          position={{
            x:
              lastPointOfSelectedRoute.x +
              editorPosition.x +
              scrollOffset.x +
              25,
            y: lastPointOfSelectedRoute.y + scrollOffset.y - 15,
          }}
        >
          <RouteFloatingMenu />
        </RouteFloatingMenuContainer>
      )}
    </>
  );
};
