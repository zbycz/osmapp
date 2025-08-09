import React from 'react';
import styled from '@emotion/styled';

import { useClimbingContext } from '../contexts/ClimbingContext';
import { RouteWithLabel } from './RouteWithLabel';
import { RouteMarks } from './RouteMarks';
import { InteractivePath } from './InteractivePath';

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
  onClick: (e: any) => void;
  onEditorMouseMove: (e: React.MouseEvent) => void;
  isVisible?: boolean;
  transformOrigin?: any;
};

export const RoutesLayer = ({
  onClick,
  onEditorMouseMove,
  isVisible = true,
}: Props) => {
  const {
    imageSize,
    getMachine,
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
  } = useClimbingContext();

  const machine = getMachine();
  const path = getCurrentPath();
  if (!path) return null;

  const handleOnMovingPointDropOnCanvas = () => {
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
      onClick={(e) => {
        onClick(e);
      }}
      onMouseUp={handleOnMovingPointDropOnCanvas}
      onPointerMove={onEditorMouseMove}
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

      {routeIndexHovered != null ? (
        <>
          <RouteWithLabel routeIndex={routeIndexHovered} />
          <InteractivePath routeIndex={routeIndexHovered} />
        </>
      ) : null}

      {routes.map((_, routeIndex) => (
        <RouteMarks key={routeIndex} routeIndex={routeIndex} />
      ))}
    </Svg>
  );
};
