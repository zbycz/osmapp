import React from 'react';
import styled from 'styled-components';
import { Button, CircularProgress } from '@material-ui/core';
import Router from 'next/router';
import Link from 'next/link';
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

const ParentItem = styled.div`
  margin: 12px 8px 0 8px;
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

          {feature.parentFeatures?.map((parentFeature) => (
            <ParentItem>
              {'< '}
              <Link href={getOsmappLink(parentFeature)}>
                {getLabel(parentFeature)}
              </Link>
            </ParentItem>
          ))}

          <HeadingContainer>
            <Heading>{label}</Heading>
            <StarButton />
          </HeadingContainer>

          <PoiDescription />

          <OsmError />

          <div style={{ padding: '35px 15px 5px' }}>
            <Properties showTags={showTagsTable} />
          </div>

          <div style={{ padding: '3em 15px', textAlign: 'center' }}>
            <Button
              color="primary"
              variant="outlined"
              size="large"
              startIcon={<ZoomInIcon fontSize="inherit" />}
              onClick={onFullScreenClick}
            >
              Show crag detail
            </Button>
          </div>

          <RouteList />

          {/* @TODO unite with parent panel */}
          <div style={{ padding: '20px 15px 0 15px' }}>{footer}</div>
        </PanelScrollbars>
      </PanelWrapper>
    </>
  );
};
