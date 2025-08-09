import React, { useState } from 'react';
import styled from '@emotion/styled';
import { RoutesLayer } from './RoutesLayer';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { updateElementOnIndex } from '../utils/array';
import { PositionPx } from '../types';
import { getPositionInImageFromMouse } from '../utils/mousePositionUtils';
import { getCommonsImageUrl } from '../../../../services/images/getCommonsImageUrl';
import { isMobileDevice } from '../../../helpers';

const EditorContainer = styled.div<{
  $imageHeight: number;
}>`
  display: flex;
  justify-content: center;
  height: ${({ $imageHeight }) => `${$imageHeight}px`};
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
  object-fit: contain; // @TODO try to delete this
  max-width: 100%;
  transition: all 0.1s ease-in;
  height: 100%;
`;

export const RoutesEditor = ({
  isRoutesLayerVisible = true,
  photoResolution,
  imageUrl,
  isPhotoLoading,
  setIsPhotoLoading,
}) => {
  const {
    imageSize,
    getMachine,
    setMousePosition,
    setIsPointMoving,
    getPercentagePosition,
    findCloserPoint,
    updatePathOnRouteIndex,
    routeSelectedIndex,
    pointSelectedIndex,
    isPointClicked,
    routeIndexHovered,
    loadPhotoRelatedData,
    loadedPhotos,
    photoRef,
    svgRef,
    photoPath,
    setLoadedPhotos,
    photoZoom,
    photoPaths,
    isPanningActiveRef,
  } = useClimbingContext();
  const machine = getMachine();
  const [transformOrigin] = useState({ x: 0, y: 0 }); // @TODO remove ?

  const onCanvasClick = (event: React.MouseEvent) => {
    if (machine.currentStateName === 'extendRoute') {
      machine.execute('addPointToEnd', event);
      return;
    }

    if (machine.currentStateName === 'pointMenu') {
      machine.execute('cancelPointMenu');
    } else if (!isPanningActiveRef) {
      machine.execute('cancelRouteSelection');
    }
  };

  // @TODO doesn't work on mobile
  const onMove = (position: PositionPx) => {
    if (isPointClicked) {
      setMousePosition(null);
      machine.execute('dragPoint', { position });
      setIsPointMoving(true);

      const newCoordinate = getPercentagePosition(position);
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
      setMousePosition(position);
    }
  };

  const onMouseMove = (event: React.MouseEvent) => {
    const positionInImage = getPositionInImageFromMouse(
      svgRef,
      event,
      photoZoom,
    );

    onMove(positionInImage);
  };

  const preloadOtherPhotos = () => {
    const photosToLoad = photoPaths.filter((path) => !loadedPhotos[path]);

    const tempLoadedPhotos = photosToLoad.reduce((acc, otherPhotoPath) => {
      const sanitizedOtherPhotoPath = decodeURI(otherPhotoPath);
      const img = new Image();
      const url = getCommonsImageUrl(
        `File:${sanitizedOtherPhotoPath}`,
        photoResolution,
      );
      img.src = url;

      return {
        ...acc,
        [sanitizedOtherPhotoPath]: {
          ...acc[sanitizedOtherPhotoPath],
          [photoResolution]: true,
        },
      };
    }, loadedPhotos);

    setLoadedPhotos(tempLoadedPhotos);
  };

  const onPhotoLoad = () => {
    setLoadedPhotos({
      ...loadedPhotos,
      [photoPath]: { ...loadedPhotos[photoPath], [photoResolution]: true },
    });
    loadPhotoRelatedData();
    preloadOtherPhotos();
    setIsPhotoLoading(false);
  };
  return (
    <EditorContainer
      $imageHeight={imageSize.height}
      onContextMenu={isMobileDevice() ? (e) => e.preventDefault() : undefined}
    >
      <ImageContainer>
        <ImageElement src={imageUrl} onLoad={onPhotoLoad} ref={photoRef} />
      </ImageContainer>
      {!isPhotoLoading && (
        <RoutesLayer
          isVisible={isRoutesLayerVisible}
          onClick={onCanvasClick}
          onEditorMouseMove={onMouseMove}
          transformOrigin={transformOrigin}
        />
      )}
    </EditorContainer>
  );
};
