import React from 'react';
import styled from '@emotion/styled';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { RouteWithLabel } from './RouteWithLabel';
import { RouteMarks } from './RouteMarks';
import { InteractivePath } from './InteractivePath';
import { updateElementOnIndex } from '../utils/array';
import { getPositionInImageFromMouse } from '../utils/mousePositionUtils';
import { useMobileMode } from '../../../helpers';

const Svg = styled.svg<{
  $hasEditableCursor: boolean;
  $imageSize: { width: number; height: number };
  $isVisible: boolean;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: ${({ $isVisible }) =>
    $isVisible ? 'opacity 0.1s ease' : 'none'};
  transform-origin: 0 0;

  ${({ $hasEditableCursor }) =>
    $hasEditableCursor ? `cursor: crosshair;` : ''};
  ${({ $imageSize: { width, height } }) =>
    `width: ${width}px;
    height:${height}px;
    /*height: 100%;*/
    > * {
      -webkit-tap-highlight-color: transparent
    }
    `}
`;

type Props = {
  isVisible: boolean;
};

export const RoutesLayer = ({ isVisible }: Props) => {
  const isMobileMode = useMobileMode();
  const {
    imageSize,
    machine,
    routeSelectedIndex,
    routeIndexHovered,
    isPointMoving,
    setIsPointClicked,
    setIsPointMoving,
    setPointSelectedIndex,
    getCurrentPath,
    routes,
    setIsPanningDisabled,
    svgRef,
    setMousePosition,
    getPercentagePosition,
    findCloserPoint,
    updatePathOnRouteIndex,
    pointSelectedIndex,
    isPointClicked,
    photoZoom,
    isAddingPointBlockedRef,
  } = useClimbingContext();
  const path = getCurrentPath();
  if (!path) return null;

  const onClick = (event: React.MouseEvent) => {
    if (
      machine.currentStateName === 'extendRoute' &&
      !isAddingPointBlockedRef.current
    ) {
      machine.execute('addPointToEnd', event);
      return;
    }

    if (machine.currentStateName === 'pointMenu') {
      machine.execute('cancelPointMenu');
      return;
    }

    if (!isAddingPointBlockedRef.current) {
      machine.execute('cancelRouteSelection');
    }
  };

  const onPointerMove = (event: React.MouseEvent) => {
    const positionInImage = getPositionInImageFromMouse(
      svgRef,
      event,
      photoZoom,
    );

    if (isPointClicked) {
      setMousePosition(null);
      machine.execute('dragPoint', { position: positionInImage });
      setIsPointMoving(true);

      const newCoordinate = getPercentagePosition(positionInImage);
      const closestPoint = findCloserPoint(newCoordinate);

      const updatedPoint = closestPoint ?? newCoordinate;
      updatePathOnRouteIndex(routeSelectedIndex, (path) =>
        updateElementOnIndex(path, pointSelectedIndex, (point) => ({
          ...point,
          x: updatedPoint.x,
          y: updatedPoint.y,
          ...(closestPoint?.type ? { type: closestPoint?.type } : {}),
        })),
      );
    } else if (machine.currentStateName !== 'extendRoute') {
      setMousePosition(null);
    } else if (routeIndexHovered === null) {
      setMousePosition(positionInImage);
    }
  };

  const handleOnMovingPointDropped = () => {
    if (isPointMoving) {
      setPointSelectedIndex(null);
      setIsPointMoving(false);
      setIsPointClicked(false);
      setIsPanningDisabled(false);
    }
  };

  return (
    <Svg
      $hasEditableCursor={machine.currentStateName === 'extendRoute'}
      onClick={onClick}
      onMouseUp={handleOnMovingPointDropped}
      onPointerMove={onPointerMove}
      $imageSize={imageSize}
      $isVisible={isVisible}
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
    >
      {routes.map((_, routeIndex) => (
        <React.Fragment key={routeIndex}>
          <RouteWithLabel routeIndex={routeIndex} />
          <InteractivePath routeIndex={routeIndex} />
        </React.Fragment>
      ))}

      {routeSelectedIndex != null ? (
        <>
          <RouteWithLabel routeIndex={routeSelectedIndex} />
          <InteractivePath routeIndex={routeSelectedIndex} />
        </>
      ) : null}

      {routeIndexHovered != null && !isMobileMode ? (
        <>
          <RouteWithLabel routeIndex={routeIndexHovered} />
          <InteractivePath routeIndex={routeIndexHovered} allowHoverMidpoint />
        </>
      ) : null}

      {routes.map((_, routeIndex) => (
        <RouteMarks key={routeIndex} routeIndex={routeIndex} />
      ))}
    </Svg>
  );
};
