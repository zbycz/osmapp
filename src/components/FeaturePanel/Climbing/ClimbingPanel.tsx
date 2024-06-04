import React from 'react';
import styled from 'styled-components';
import { Button, CircularProgress } from '@material-ui/core';
import Router from 'next/router';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
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
import { OsmError } from '../OsmError';
import { Properties } from '../Properties/Properties';
import { PoiDescription } from '../ImageSection/PoiDescription';
import { RouteDistribution } from './RouteDistribution';
import { YellowedBadge } from './YellowedBadge';
import { ClimbingParentLink } from '../ParentLink';
import { getFeaturePhotos } from './utils/photo';
import { ImageSlider } from '../ImagePane/ImageSlider';

const ThumbnailContainer = styled.div<{ height: number }>`
  width: 100%;
  height: ${({ height }) => height}px;
  position: relative;
  :hover ${FullscreenIconContainer} {
    visibility: visible;
    -webkit-backdrop-filter: blur(3px);
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

const DetailButtonContainer = styled.div`
  margin: 8px;
  @supports (-webkit-touch-callout: none) {
    /* CSS specific to iOS devices */
    margin-bottom: 28px;
  }
`;

const Heading = styled.div`
  margin: 12px 8px 4px;
  font-size: 36px;
  line-height: 0.98;
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

export const ClimbingPanel = ({ footer, showTagsTable }) => {
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
  const cragPhotos = getFeaturePhotos(feature);
  preparePhotosAndSet(cragPhotos);

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

          <ClimbingParentLink />

          <HeadingContainer>
            <Heading>{label}</Heading>
            <YellowedBadge />
            <StarButton />
          </HeadingContainer>

          <PoiDescription />

          <OsmError />

          <RouteDistribution />
          <RouteList />
          <ImageSlider />

          <div style={{ padding: '35px 15px 5px' }}>
            <Properties showTags={showTagsTable} />
          </div>

          {/* @TODO unite with parent panel */}
          <div style={{ padding: '20px 15px 0 15px' }}>{footer}</div>
        </PanelScrollbars>
        <DetailButtonContainer>
          <Button
            color="primary"
            size="large"
            startIcon={<ZoomInIcon fontSize="inherit" />}
            onClick={onFullScreenClick}
            fullWidth
            variant="contained"
          >
            Show crag detail
          </Button>
        </DetailButtonContainer>
      </PanelWrapper>
    </>
  );
};
