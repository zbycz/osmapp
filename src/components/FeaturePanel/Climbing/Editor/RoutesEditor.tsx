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
    loadPhotoRelatedData,
    loadedPhotos,
    photoRef,
    photoPath,
    setLoadedPhotos,
    photoPaths,
  } = useClimbingContext();

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
      {!isPhotoLoading && <RoutesLayer isVisible={isRoutesLayerVisible} />}
    </EditorContainer>
  );
};
