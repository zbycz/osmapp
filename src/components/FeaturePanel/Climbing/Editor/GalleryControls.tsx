import React from 'react';
import styled from '@emotion/styled';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import Router from 'next/router';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { getOsmappLink } from '../../../../services/helpers';
import { useFeatureContext } from '../../../utils/FeatureContext';

const BUTTON_SIZE_VW = 6;

const GalleryButton = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-backdrop-filter: blur(40px);
  backdrop-filter: blur(40px);

  width: ${BUTTON_SIZE_VW}vw;
  height: ${BUTTON_SIZE_VW}vw;
  min-width: 32px;
  min-height: 32px;

  max-width: 50px;
  max-height: 50px;
  border-radius: 50%;
  top: calc(50% - ${BUTTON_SIZE_VW / 2}vw);
  border: solid 1px rgba(255, 255, 255, 0.3);
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
  }
`;

const PreviousImage = styled(GalleryButton)`
  left: 4px;
`;

const NextImage = styled(GalleryButton)`
  right: 4px;
`;

export const GalleryControls = () => {
  const {
    photoPaths,
    photoPath,
    setAreRoutesLoading,
    setPhotoPath,
    loadPhotoRelatedData,
    isEditMode,
  } = useClimbingContext();

  if (isEditMode) return null;

  const { feature } = useFeatureContext();

  const photoIndex = photoPaths.indexOf(photoPath);

  const prevIndex = photoIndex === 0 ? null : photoIndex - 1;
  const nextIndex =
    photoIndex === photoPaths.length - 1 ? null : photoIndex + 1;
  const onPhotoChange = (photo: string) => {
    Router.push(
      `${getOsmappLink(feature)}/climbing/${photo}${window.location.hash}`,
    );

    setAreRoutesLoading(true);
    setPhotoPath(photo);
    setTimeout(() => {
      // @TODO fix it without timeout
      loadPhotoRelatedData();
    }, 100);
  };

  return (
    <>
      {prevIndex !== null && (
        <PreviousImage onClick={() => onPhotoChange(photoPaths[prevIndex])}>
          <ArrowBack />
        </PreviousImage>
      )}
      {nextIndex !== null && (
        <NextImage onClick={() => onPhotoChange(photoPaths[nextIndex])}>
          <ArrowForward />
        </NextImage>
      )}
    </>
  );
};
