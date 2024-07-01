import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { Button } from '@mui/material';
import { useClimbingContext } from './contexts/ClimbingContext';
import { RouteList } from './RouteList/RouteList';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getLabel } from '../../../helpers/featureLabel';
import { getOsmappLink } from '../../../services/helpers';
import { StarButton } from '../ImageSection/StarButton';
import { OsmError } from '../OsmError';
import { Properties } from '../Properties/Properties';
import { PoiDescription } from '../ImageSection/PoiDescription';
import { ImageSlider } from '../ImagePane/ImageSlider';
import { ClimbingParentLink } from '../ParentLink';
import { RouteDistribution } from './RouteDistribution';
import { YellowedBadge } from './YellowedBadge';
import { getWikimediaCommonsKeys, removeFilePrefix } from './utils/photo';
import { SuggestEdit } from '../SuggestEdit';
import { PanelContent } from '../../utils/PanelHelpers';

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

export const ClimbingPanel = ({ footer, showTagsTable }) => {
  const { feature } = useFeatureContext();
  const label = getLabel(feature);

  const { preparePhotosAndSet } = useClimbingContext();

  const onFullScreenClick = () => {
    Router.push(`${getOsmappLink(feature)}/climbing${window.location.hash}`);
  };
  const cragPhotos = getWikimediaCommonsKeys(feature.tags)
    .map((key) => feature.tags[key])
    .map(removeFilePrefix);
  preparePhotosAndSet(cragPhotos);

  return (
    <PanelContent>
      {/* <PanelWrapper>
        <PanelScrollbars> */}
      <ClimbingParentLink />

      <HeadingContainer>
        <Heading>{label}</Heading>
        <YellowedBadge />
        <StarButton />
      </HeadingContainer>
      <PoiDescription />

      <ImageSlider />
      <OsmError />

      <RouteDistribution />
      <RouteList />

      <div style={{ padding: '35px 15px 5px' }}>
        <Properties showTags={showTagsTable} />
      </div>

      <SuggestEdit />
      {/* @TODO unite with parent panel */}
      <div style={{ padding: '20px 15px 0 15px' }}>{footer}</div>
      {/* </PanelScrollbars> */}
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
      {/* </PanelWrapper> */}
    </PanelContent>
  );
};
