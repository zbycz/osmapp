import React from 'react';
import styled from 'styled-components';

import { useClimbingContext } from '../contexts/ClimbingContext';
import { RouteWithLabel } from './RouteWithLabel';
import { RouteFloatingMenu } from './RouteFloatingMenu';
import { Position, ZoomState } from '../types';
import { RouteMarks } from './RouteMarks';

type RouteRenders = { route: React.ReactNode; marks: React.ReactNode };

const Svg = styled.svg<{
  hasEditableCursor: boolean;
  imageSize: { width: number; height: number };
  isVisible: boolean;
  photoZoom: ZoomState;
  transformOrigin: any;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: ${({ isVisible }) => (isVisible ? 'opacity 0.1s ease' : 'none')};
  transform-origin: 0 0;
  ${({ hasEditableCursor }) =>
    `cursor: ${hasEditableCursor ? 'crosshair' : 'auto'}`};
  ${({ imageSize: { width, height } }) =>
    `width: ${width}px;
    height:${height}px;
    /*height: 100%;*/
    > * {
      -webkit-tap-highlight-color: transparent
    }
    `}
`;

const RouteFloatingMenuContainer = styled.div<{ position: Position }>`
  position: absolute;
  left: ${({ position }) => position.x}px;
  top: ${({ position }) => position.y}px;
  z-index: 10000;
`;
type Props = {
  onClick: (e: any) => void;
  onEditorMouseMove?: (e: any) => void;
  onEditorTouchMove?: (e: any) => void;
  isVisible?: boolean;
  transformOrigin?: any;
};

export const RoutesLayer = ({
  onClick,
  onEditorMouseMove,
  onEditorTouchMove,
  isVisible = true,
  transformOrigin = { x: 0, y: 0 },
}: Props) => {
  const {
    imageSize,
    pointSelectedIndex,
    routeSelectedIndex,
    getMachine,
    isRouteSelected,
    getPixelPosition,
    editorPosition,
    scrollOffset,
    isPointMoving,
    setIsPointClicked,
    setIsPointMoving,
    setPointSelectedIndex,
    getCurrentPath,
    routes,
  } = useClimbingContext();

  const machine = getMachine();
  const path = getCurrentPath();
  if (!path) return null;

  const onPointInSelectedRouteClick = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    machine.execute('showPointMenu');
    const isDoubleClick = event.detail === 2;
    const lastPointIndex = path.length - 1;

    if (isDoubleClick && pointSelectedIndex === lastPointIndex) {
      machine.execute('finishRoute');
    }
  };

  const handleMovingPointDrop = () => {
    if (isPointMoving) {
      setPointSelectedIndex(null);
      setIsPointMoving(false);
      setIsPointClicked(false);
    }
  };

  const sortedRoutes = routes.reduce<{
    selected: Array<RouteRenders>;
    rest: Array<RouteRenders>;
  }>(
    (acc, route, index) => {
      const RenderRoute = () => (
        <RouteWithLabel
          route={route}
          routeNumber={index}
          onPointInSelectedRouteClick={onPointInSelectedRouteClick}
        />
      );
      const RenderRouteMarks = () => (
        <RouteMarks
          route={route}
          routeNumber={index}
          onPointInSelectedRouteClick={onPointInSelectedRouteClick}
        />
      );

      if (isRouteSelected(index)) {
        return {
          ...acc,
          selected: [
            ...acc.selected,
            { route: <RenderRoute />, marks: <RenderRouteMarks /> },
          ],
        };
      }
      return {
        ...acc,
        rest: [
          ...acc.rest,
          { route: <RenderRoute />, marks: <RenderRouteMarks /> },
        ],
      };
    },
    { selected: [], rest: [] },
  );

  const lastPointOfSelectedRoute =
    routeSelectedIndex !== null && path.length > 0
      ? getPixelPosition(path[path.length - 1])
      : null;

  const selectedPointOfSelectedRoute =
    pointSelectedIndex !== null && path.length > 0 && routes[routeSelectedIndex]
      ? getPixelPosition(path[pointSelectedIndex])
      : null;

  const routeFloatingMenuPosition =
    machine.currentStateName === 'pointMenu'
      ? selectedPointOfSelectedRoute
      : lastPointOfSelectedRoute;

  return (
    <>
      <Svg
        hasEditableCursor={machine.currentStateName === 'extendRoute'}
        onClick={(e) => {
          onClick(e);
        }}
        onMouseUp={handleMovingPointDrop}
        onMouseMove={onEditorMouseMove}
        onTouchMove={onEditorTouchMove}
        onPointerMove={onEditorTouchMove}
        imageSize={imageSize}
        isVisible={isVisible}
        transformOrigin={transformOrigin}
      >
        {sortedRoutes.rest.map((item) => item.route)}
        {sortedRoutes.rest.map((item) => item.marks)}
        {sortedRoutes.selected.map((item) => item.route)}
        {sortedRoutes.selected.map((item) => item.marks)}
      </Svg>

      {routeFloatingMenuPosition && (
        <RouteFloatingMenuContainer
          position={{
            x:
              routeFloatingMenuPosition.x +
              editorPosition.x +
              scrollOffset.x +
              30,
            y: routeFloatingMenuPosition.y + scrollOffset.y - 15,
          }}
        >
          <RouteFloatingMenu />
        </RouteFloatingMenuContainer>
      )}
    </>
  );
};
