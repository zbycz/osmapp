import React from 'react';
import styled from 'styled-components';

import { useClimbingContext } from '../contexts/ClimbingContext';
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
  onEditorMouseMove,
  onEditorTouchMove,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); // @TODO rename

  const {
    imageSize,
    isSelectedRouteEditable,
    pointSelectedIndex,
    routeSelectedIndex,
    useMachine,
    isRouteSelected,
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

  return (
    <>
      <Svg
        hasEditableCursor={isSelectedRouteEditable}
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
    </>
  );
};
