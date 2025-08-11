import React, { useState } from 'react';
import styled from '@emotion/styled';
import { FeatureHeading } from './FeatureHeading';
import { useMobileMode, useToggleState } from '../helpers';
import { getReactKey } from '../../services/helpers';
import { PanelContent, PanelSidePadding } from '../utils/PanelHelpers';
import { useFeatureContext } from '../utils/FeatureContext';
import { OsmError } from './OsmError';
import { Members } from './Members';
import { PublicTransport } from './PublicTransport/PublicTransport';
import { Properties } from './Properties/Properties';
import { MemberFeatures } from './MemberFeatures/MemberFeatures';
import { ParentLink } from './ParentLink';
import { FeatureImages } from './FeatureImages/FeatureImages';
import { FeatureOpenPlaceGuideLink } from './FeatureOpenPlaceGuideLink';
import { CragsInArea } from './CragsInArea';
import { ClimbingRestriction } from './Climbing/ClimbingRestriction';
import { Runways } from './Runways/Runways';
import { EditButton } from './EditButton';
import { EditDialog } from './EditDialog/EditDialog';
import { RouteDistributionInFeaturePanel } from './Climbing/RouteDistribution';
import { FeaturePanelFooter } from './FeaturePanelFooter';
import { ClimbingRouteGrade } from './ClimbingRouteGrade';
import { Box, Stack } from '@mui/material';
import { ClimbingStructuredData } from './Climbing/ClimbingStructuredData';
import { isPublictransportRoute } from '../../utils';
import { Sockets } from './Sockets/Sockets';
import { ClimbingBadges, PanelClimbingBadges } from './Climbing/ClimbingBadges';
import { TestApiWarning } from './helpers/TestApiWarning';
import { FeaturePanelClimbingGuideInfo } from './Climbing/FeaturePanelClimbingGuideInfo';
import { FeaturedTag } from './FeaturedTag';

const Flex = styled.div`
  flex: 1;
  margin-bottom: 40px;
`;

type FeaturePanelProps = {
  headingRef?: React.Ref<HTMLDivElement>;
};

export const FeaturePanel = ({ headingRef }: FeaturePanelProps) => {
  const { feature } = useFeatureContext();
  const [advanced, setAdvanced] = useState(false);
  const [showTags, toggleShowTags] = useToggleState(false);
  const isMobileMode = useMobileMode();

  const { tags, skeleton, deleted } = feature;
  const showTagsTable = deleted || showTags || (!skeleton && !feature.schema);

  if (!feature) {
    return null;
  }

  // ------------------------------------------------------------------------
  // Different components are shown for different types of features
  // Conditional components should have if(feature.tags.xxx) check at the beginning
  // All components should have margin-bottoms to accommodate missing parts
  // ------------------------------------------------------------------------

  const movePropertiesBelowMembers = tags.climbing === 'crag';
  const PropertiesComponent = () => (
    <Properties showTags={showTagsTable} key={getReactKey(feature)} />
  );

  return (
    <>
      <PanelContent>
        <PanelSidePadding>
          {!isMobileMode && <ParentLink />}

          <FeatureHeading ref={headingRef} />
          <Stack spacing={1} alignItems="flex-start" sx={{ marginBottom: 1 }}>
            <ClimbingRouteGrade />
            <PanelClimbingBadges />
          </Stack>

          <ClimbingRestriction />

          <OsmError />
          <TestApiWarning />
          <FeaturedTag k="description" renderer="DescriptionRenderer" />
          {isMobileMode && <ParentLink />}
        </PanelSidePadding>

        <Flex>
          {!skeleton && (
            <>
              <CragsInArea />

              <Box mb={2}>
                <FeatureImages />
              </Box>

              <PanelSidePadding>
                {!movePropertiesBelowMembers && <PropertiesComponent />}
              </PanelSidePadding>
              <RouteDistributionInFeaturePanel />
              <PanelSidePadding>
                {!isPublictransportRoute(feature) && <MemberFeatures />}
                {advanced && <Members />}
                {movePropertiesBelowMembers && <PropertiesComponent />}
                <PublicTransport />
                <Runways />
                <Sockets />
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
        <FeaturePanelClimbingGuideInfo />
      </PanelContent>
      <ClimbingStructuredData />
    </>
  );
};
