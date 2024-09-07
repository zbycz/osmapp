import React, { useState } from 'react';
import styled from '@emotion/styled';
import { FeatureHeading } from './FeatureHeading';
import { useToggleState } from '../helpers';
import { getKey } from '../../services/helpers';
import { PanelContent, PanelSidePadding } from '../utils/PanelHelpers';
import { useFeatureContext } from '../utils/FeatureContext';
import { OsmError } from './OsmError';
import { Members } from './Members';
import { PublicTransport } from './PublicTransport/PublicTransport';
import { Properties } from './Properties/Properties';
import { MemberFeatures } from './MemberFeatures/MemberFeatures';
import { ParentLink } from './ParentLink';
import { FeatureImages } from './ImagePane/FeatureImages';
import { FeatureOpenPlaceGuideLink } from './FeatureOpenPlaceGuideLink';
import { CragsInArea } from './CragsInArea';
import { ClimbingRestriction } from './Climbing/ClimbingRestriction';
import { Runways } from './Runways/Runways';
import { EditButton } from './EditButton';
import { EditDialog } from './EditDialog/EditDialog';
import { RouteDistributionInPanel } from './Climbing/RouteDistribution';
import { RouteListInPanel } from './Climbing/RouteList/RouteList';
import { FeaturePanelFooter } from './FeaturePanelFooter';
import { ClimbingRouteGrade } from './ClimbingRouteGrade';
import { Box } from '@mui/material';

const Flex = styled.div`
  flex: 1;
`;

export const FeaturePanel = () => {
  const { feature } = useFeatureContext();
  const [advanced, setAdvanced] = useState(false);
  const [showTags, toggleShowTags] = useToggleState(false);

  const { tags, skeleton, deleted } = feature;
  const showTagsTable = deleted || showTags || (!skeleton && !feature.schema);

  if (!feature) {
    return null;
  }

  // Different components are shown for different types of features
  // Conditional components should have if(feature.tags.xxx) check at the beggining
  // All components should have margin-bottoms to accomodate missing parts
  const isClimbingCrag = tags.climbing === 'crag';

  const PropertiesComponent = () => (
    <Properties showTags={showTagsTable} key={getKey(feature)} />
  );
  return (
    <>
      <PanelContent>
        <PanelSidePadding>
          <FeatureHeading />
          <ClimbingRouteGrade />
          <ParentLink />
          <ClimbingRestriction />

          <OsmError />
        </PanelSidePadding>

        <Flex>
          {!skeleton && (
            <>
              <PanelSidePadding>
                <CragsInArea />
              </PanelSidePadding>

              <Box mb={2}>
                <FeatureImages />
              </Box>

              <PanelSidePadding>
                {!isClimbingCrag && <PropertiesComponent />}
                <RouteDistributionInPanel />
                <MemberFeatures />
                {advanced && <Members />}
                {isClimbingCrag && <PropertiesComponent />}

                <PublicTransport tags={tags} />
                <Runways />

                <FeatureOpenPlaceGuideLink />

                <EditButton />
                <EditDialog />
              </PanelSidePadding>
            </>
          )}
        </Flex>

        <FeaturePanelFooter
          advanced={advanced}
          setAdvanced={setAdvanced}
          showTagsTable={showTagsTable}
          toggleShowTags={toggleShowTags}
        />
      </PanelContent>
    </>
  );
};
