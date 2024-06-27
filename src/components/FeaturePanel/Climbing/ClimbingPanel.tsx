import React from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';
import { PanelScrollbars, PanelWrapper } from '../../utils/PanelHelpers';
import { RouteList } from './RouteList/RouteList';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getLabel } from '../../../helpers/featureLabel';
import { StarButton } from '../ImageSection/StarButton';
import { OsmError } from '../OsmError';
import { Properties } from '../Properties/Properties';
import { PoiDescription } from '../ImageSection/PoiDescription';
import { ImageSlider } from '../ImagePane/ImageSlider';
import { ClimbingParentLink } from '../ParentLink';
import { RouteDistribution } from './RouteDistribution';
import { YellowedBadge } from './YellowedBadge';
import { SuggestEdit } from '../SuggestEdit';

const HeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Heading = styled.div`
  margin: 12px 8px 4px;
  font-size: 36px;
  line-height: 0.98;
`;

export const ClimbingPanel = ({ footer, showTagsTable }) => {
  const { feature } = useFeatureContext();
  const label = getLabel(feature);

  return (
    <>
      <PanelWrapper>
        <PanelScrollbars>
          <ClimbingParentLink />

          <HeadingContainer>
            <Heading>{label}</Heading>
            <YellowedBadge />
            <StarButton />
          </HeadingContainer>

          <PoiDescription />

          <OsmError />

          <Box mt={2}>
            <ImageSlider />
          </Box>

          <RouteDistribution />
          <RouteList />

          <div style={{ padding: '35px 15px 5px' }}>
            <Properties showTags={showTagsTable} />
          </div>

          <SuggestEdit />

          {/* @TODO unite with parent panel */}
          <div style={{ padding: '20px 15px 0 15px' }}>{footer}</div>
        </PanelScrollbars>
      </PanelWrapper>
    </>
  );
};
