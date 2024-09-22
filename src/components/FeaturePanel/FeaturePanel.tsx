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
import { FeaturePanelFooter } from './FeaturePanelFooter';
import { ClimbingRouteGrade } from './ClimbingRouteGrade';
import { Box } from '@mui/material';
import { ClimbingGuideInfo } from './Climbing/ClimbingGuideInfo';
import { UploadDialog } from './UploadDialog/UploadDialog';

const Flex = styled.div`
  flex: 1;
`;

type FeaturePanelProps = {
  headingRef?: React.Ref<HTMLDivElement>;
};

export const FeaturePanel = ({ headingRef }: FeaturePanelProps) => {
  const { feature } = useFeatureContext();
  const [advanced, setAdvanced] = useState(false);
  const [showTags, toggleShowTags] = useToggleState(false);

  const { tags, skeleton, deleted } = feature;
  const showTagsTable = deleted || showTags || (!skeleton && !feature.schema);

  if (!feature) {
    return null;
  }

  // Different components are shown for different types of features
  // Conditional components should have if(feature.tags.xxx) check at the beginning
  // All components should have margin-bottoms to accommodate missing parts
  const isClimbingCrag = tags.climbing === 'crag';

  const PropertiesComponent = () => (
    <Properties showTags={showTagsTable} key={getKey(feature)} />
  );
  return (
    <>
      <PanelContent>
        <PanelSidePadding>
          <FeatureHeading ref={headingRef} />
          <ClimbingRouteGrade />
          <ClimbingGuideInfo />
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
                {advanced && (
                  <PanelSidePadding>
                    <UploadDialog />
                  </PanelSidePadding>
                )}

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
