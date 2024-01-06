import React from 'react';
import styled from 'styled-components';

import { useClimbingContext } from '../contexts/ClimbingContext';
import { RouteWithLabel } from './RouteWithLabel';
import { RouteFloatingMenu } from './RouteFloatingMenu';
import { Position, Size } from '../types';

const Svg = styled.svg<{
  hasEditableCursor: boolean;
  imageSize: { width: number; height: number };
  isVisible: boolean;
}>`
  position: absolute;
  /* left: 0; */
  top: 0;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: ${({ isVisible }) => (isVisible ? 'opacity 0.6s ease' : 'none')};
  ${({ hasEditableCursor }) =>
    `cursor: ${hasEditableCursor ? 'crosshair' : 'auto'}`};
  ${({ imageSize: { width, height } }) =>
    `width: ${width}px;
    height:${height}px;
    /*height: 100%;*/
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
  // imageSize: Size;
};

// @TODO rename onFinishClimbingRouteClick?
export const RoutesLayer = ({
  onClick,
  onEditorMouseMove,
  onEditorTouchMove,
  isVisible = true,
}: Props) => {
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); // @TODO rename

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

  // console.log('____imageSize', imageSize);
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

    // setAnchorEl(anchorEl !== null ? null : event.currentTarget);
  };
  // console.log('_______', pointElement);

  const handleMovingPointDrop = () => {
    if (isPointMoving) {
      setPointSelectedIndex(null);
      setIsPointMoving(false);
      setIsPointClicked(false);
    }
  };

  const sortedRoutes = routes.reduce(
    (acc, route, index) => {
      const RenderRoute = () => (
        <RouteWithLabel
          route={route}
          routeNumber={index}
          onPointInSelectedRouteClick={onPointInSelectedRouteClick}
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
        imageSize={imageSize}
        isVisible={isVisible}
      >
        {sortedRoutes.rest}
        {sortedRoutes.selected}
      </Svg>

      {/* <PointMenu anchorEl={pointElement} setAnchorEl={setPointElement} /> */}
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
