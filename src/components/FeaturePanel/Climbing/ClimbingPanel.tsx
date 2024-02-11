import React from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';
import Router from 'next/router';
import { useClimbingContext } from './contexts/ClimbingContext';
import { PanelScrollbars, PanelWrapper } from '../../utils/PanelHelpers';
import { RoutesLayer } from './Editor/RoutesLayer';
import { RouteList } from './RouteList/RouteList';
import { FullscreenIconContainer, ShowFullscreen } from './ShowFullscreen';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getLabel } from '../../../helpers/featureLabel';
import { getWikiImage2 } from '../../../services/images/getWikiImage';
import { getOsmappLink } from '../../../services/helpers';

const ThumbnailContainer = styled.div<{ height: number }>`
  width: 100%;
  height: ${({ height }) => height}px;
  position: relative;
  :hover ${FullscreenIconContainer} {
    visibility: visible;
    backdrop-filter: blur(3px);
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
`;

const Heading = styled.div`
  margin: 12px 8px 4px;
  font-size: 36px;
  line-height: 0.98;
  color: ${({ theme }) => theme.palette.text.panelHeading};

  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;
const Thumbnail = styled.img<{ isLoading: boolean }>`
  width: 100%;
  position: absolute;
  visibility: ${({ isLoading }) => (isLoading ? 'hidden' : 'visible')};
`;

const LoadingContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  align-items: center;
`;

export const ClimbingPanel = ({ footer }) => {
  const { feature } = useFeatureContext();
  const label = getLabel(feature);

  const {
    // setIsEditMode,
    loadPhotoRelatedData,
    imageSize,
    photoPath,
    photoRef,
    // setPointSelectedIndex,
    preparePhotosAndSetFirst,
  } = useClimbingContext();

  // useEffect(() => {
  //   if (!isFullscreenDialogOpened) {
  //     // @TODO create a new state for closing fullscreen dialog
  //     setIsEditMode(false);
  //     setPointSelectedIndex(null);
  //   }
  // }, [isFullscreenDialogOpened]);

  const onFullScreenClick = () => {
    Router.push(`${getOsmappLink(feature)}/climbing${window.location.hash}`);
  };

  preparePhotosAndSetFirst();

  const image = getWikiImage2(photoPath, 500);

  const onPhotoLoad = () => {
    loadPhotoRelatedData();
  };

  // useEffect(() => {
  //   loadPhotoRelatedData();
  // }, [isFullscreenDialogOpened]);

  const isPhotoLoading = imageSize.height === 0;
  return (
    <>
      <PanelWrapper>
        <PanelScrollbars>
          {image && (
            <ThumbnailContainer
              height={isPhotoLoading ? 200 : imageSize.height}
            >
              {isPhotoLoading && (
                <LoadingContainer>
                  <CircularProgress />
                </LoadingContainer>
              )}

              <Thumbnail
                src={image}
                ref={photoRef}
                onLoad={onPhotoLoad}
                isLoading={isPhotoLoading}
              />

              {!isPhotoLoading && <RoutesLayer onClick={() => null} />}
              <ShowFullscreen onClick={onFullScreenClick} />
            </ThumbnailContainer>
          )}
          <Heading onClick={onFullScreenClick}>{label}</Heading>

          <RouteList />

          {/* TODO unite with parent panel */}
          <div style={{ padding: '20px 15px 0 15px' }}>{footer}</div>
        </PanelScrollbars>
      </PanelWrapper>
    </>
  );
};
