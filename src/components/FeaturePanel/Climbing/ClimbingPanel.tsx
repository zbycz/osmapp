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
import { getCommonsImageUrl } from '../../../services/images/getWikiImage';
import { getOsmappLink } from '../../../services/helpers';
import { StarButton } from '../ImageSection/StarButton';

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

const HeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Heading = styled.div`
  margin: 12px 8px 4px;
  font-size: 36px;
  line-height: 0.98;

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
    loadPhotoRelatedData,
    imageSize,
    photoPath,
    photoRef,
    preparePhotosAndSet,
  } = useClimbingContext();

  const onFullScreenClick = () => {
    Router.push(`${getOsmappLink(feature)}/climbing${window.location.hash}`);
  };

  preparePhotosAndSet();

  const imageUrl = getCommonsImageUrl(`File:${photoPath}`, 500);

  const onPhotoLoad = () => {
    loadPhotoRelatedData();
  };

  const isPhotoLoading = imageSize.height === 0;
  return (
    <>
      <PanelWrapper>
        <PanelScrollbars>
          {photoPath && imageUrl && (
            <ThumbnailContainer
              height={isPhotoLoading ? 200 : imageSize.height}
            >
              {isPhotoLoading && (
                <LoadingContainer>
                  <CircularProgress />
                </LoadingContainer>
              )}

              <Thumbnail
                src={imageUrl}
                ref={photoRef}
                onLoad={onPhotoLoad}
                isLoading={isPhotoLoading}
              />

              {!isPhotoLoading && <RoutesLayer onClick={() => null} />}
              <ShowFullscreen onClick={onFullScreenClick} />
            </ThumbnailContainer>
          )}
          <HeadingContainer>
            <Heading onClick={onFullScreenClick}>{label}</Heading>
            <StarButton />
          </HeadingContainer>
          <RouteList />

          {/* @TODO unite with parent panel */}
          <div style={{ padding: '20px 15px 0 15px' }}>{footer}</div>
        </PanelScrollbars>
      </PanelWrapper>
    </>
  );
};
