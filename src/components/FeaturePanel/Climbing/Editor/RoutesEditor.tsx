import React, { useState } from 'react';
import styled from 'styled-components';
import { RoutesLayer } from './RoutesLayer';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { updateElementOnIndex } from '../utils/array';
import { PositionPx } from '../types';

const EditorContainer = styled.div<{ imageHeight: number }>`
  display: flex;
  justify-content: center;
  height: ${({ imageHeight }) => `${imageHeight}px`};
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const ImageContainer = styled.div`
  user-select: none;
  position: absolute;
  top: 0;
  height: 100%;
  box-shadow: 0 -0 110px rgba(0, 0, 0, 0.1);

  // @TODO fix positioning on mobile
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
`;

const ImageElement = styled.img<{ zoom?: number }>`
  object-fit: contain;
  max-width: 100%;
  transition: all 0.1s ease-in;
  height: 100%;
`;

export const RoutesEditor = ({
  isRoutesLayerVisible = true,
  setIsPhotoLoaded,
  imageUrl,
}) => {
  const {
    imageSize,
    getMachine,
    addOffsets,
    setMousePosition,
    setIsPointMoving,
    getPercentagePosition,
    findCloserPoint,
    updatePathOnRouteIndex,
    routeSelectedIndex,
    pointSelectedIndex,
    isPointClicked,
    isLineInteractiveAreaHovered,
    loadPhotoRelatedData,
    photoRef,
  } = useClimbingContext();
  const machine = getMachine();
  const [transformOrigin] = useState({ x: 0, y: 0 }); // @TODO remove ?

  const onCanvasClick = (e) => {
    if (machine.currentStateName === 'extendRoute') {
      machine.execute('addPointToEnd', {
        position: { x: e.clientX, y: e.clientY },
      });
      return;
    }

    if (machine.currentStateName === 'pointMenu') {
      machine.execute('cancelPointMenu');
    } else {
      machine.execute('cancelRouteSelection');
    }
  };

  // @TODO doesn't work on mobile
  const onMove = (position: PositionPx) => {
    if (isPointClicked) {
      setMousePosition(null);
      machine.execute('dragPoint', { position });

      setIsPointMoving(true);
      const newCoordinate = getPercentagePosition(
        addOffsets(['editorPosition'], position),
      );

      const closestPoint = findCloserPoint(newCoordinate);

      const updatedPoint = closestPoint ?? newCoordinate;
      updatePathOnRouteIndex(routeSelectedIndex, (path) =>
        updateElementOnIndex(path, pointSelectedIndex, (point) => ({
          ...point,
          x: updatedPoint.x,
          y: updatedPoint.y,
        })),
      );
    } else if (machine.currentStateName !== 'extendRoute') {
      setMousePosition(null);
    } else if (!isLineInteractiveAreaHovered) {
      setMousePosition(position);
    }
  };

  const onTouchMove = (e) => {
    onMove({ x: e.clientX, y: e.clientY, units: 'px' });
  };

  const onMouseMove = (e) => {
    onMove(
      addOffsets(['scrollOffset'], {
        x: e.clientX,
        y: e.clientY,
        units: 'px',
      }),
    );
  };

  const onPhotoLoad = () => {
    setIsPhotoLoaded(true);
    loadPhotoRelatedData();
  };

  return (
    <EditorContainer imageHeight={imageSize.height}>
      <ImageContainer>
        <ImageElement src={imageUrl} onLoad={onPhotoLoad} ref={photoRef} />
      </ImageContainer>
      <RoutesLayer
        isVisible={isRoutesLayerVisible}
        onClick={onCanvasClick}
        onEditorMouseMove={onMouseMove}
        onEditorTouchMove={onTouchMove}
        transformOrigin={transformOrigin}
      />
    </EditorContainer>
  );
};
