import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { FeatureHeading } from './FeatureHeading';
import Coordinates from './Coordinates';
import { useToggleState } from '../helpers';
import { getFullOsmappLink, getKey } from '../../services/helpers';
import {
  PanelContent,
  PanelFooter,
  PanelSidePadding,
} from '../utils/PanelHelpers';
import { useFeatureContext } from '../utils/FeatureContext';
import { t } from '../../services/intl';
import { FeatureDescription } from './FeatureDescription';
import { ObjectsAround } from './ObjectsAround';
import { OsmError } from './OsmError';
import { Members } from './Members';
import { getLabel } from '../../helpers/featureLabel';
import { PublicTransport } from './PublicTransport/PublicTransport';
import { Properties } from './Properties/Properties';
import { MemberFeatures } from './MemberFeatures';
import { ClimbingCragPanel } from './Climbing/ClimbingCragPanel';
import { ClimbingContextProvider } from './Climbing/contexts/ClimbingContext';
import { isClimbingRelation } from '../../services/osmApi';
import { ParentLink } from './ParentLink';
import { FeatureImages } from './ImagePane/FeatureImages';
import { FeatureOpenPlaceGuideLink } from './FeatureOpenPlaceGuideLink';
import { CragsInArea } from './CragsInArea';
import { ClimbingRestriction } from './Climbing/ClimbingRestriction';
import { Runways } from './Runways/Runways';
import { EditButton } from './EditButton';
import { EditDialog } from './EditDialog/EditDialog';
import { getIsClimbingRoute } from '../utils/openClimbingUtils';
import { ConvertedRouteDifficultyBadge } from './Climbing/ConvertedRouteDifficultyBadge';
import { getDifficulties } from './Climbing/utils/grades/routeGrade';

const Flex = styled.div`
  flex: 1;
`;

export const FeaturePanelInner = () => {
  const { feature } = useFeatureContext();

  const [advanced, setAdvanced] = useState(false);
  const [showAround, toggleShowAround] = useToggleState(false);
  const [showTags, toggleShowTags] = useToggleState(false);

  const { point, tags, skeleton, deleted } = feature;
  const editEnabled = !skeleton;
  const showTagsTable = deleted || showTags || (!skeleton && !feature.schema);

  const osmappLink = getFullOsmappLink(feature);
  const label = getLabel(feature);

  const footer = (
    <PanelFooter>
      <FeatureDescription advanced={advanced} setAdvanced={setAdvanced} />
      <Coordinates />
      <br />
      <a href={osmappLink}>{osmappLink}</a>
      <br />
      <label>
        <input
          type="checkbox"
          onChange={toggleShowTags}
          checked={showTagsTable}
          disabled={point || deleted || (!skeleton && !feature.schema)}
        />{' '}
        {t('featurepanel.show_tags')}
      </label>{' '}
      <label>
        <input
          type="checkbox"
          onChange={toggleShowAround}
          checked={showAround}
        />{' '}
        {t('featurepanel.show_objects_around')}
      </label>
      {showAround && <ObjectsAround advanced={advanced} />}
    </PanelFooter>
  );

  if (!feature) {
    return null;
  }

  if (
    isClimbingRelation(feature) && // only for this condition is memberFeatures fetched
    feature.tags.climbing === 'crag' &&
    !advanced
  ) {
    return (
      <ClimbingContextProvider feature={feature} key={getKey(feature)}>
        <ClimbingCragPanel footer={footer} showTagsTable={showTagsTable} />
      </ClimbingContextProvider>
    );
  }
  const isClimbingRoute = getIsClimbingRoute(feature?.tags);
  const routeDifficulties = getDifficulties(feature?.tags);

  return (
    <>
      <PanelContent>
        <PanelSidePadding>
          <FeatureHeading />
          {isClimbingRoute && (
            <ConvertedRouteDifficultyBadge
              routeDifficulties={routeDifficulties}
            />
          )}
          <ParentLink />

          <ClimbingRestriction />

          <OsmError />
          <CragsInArea />
        </PanelSidePadding>

        <Flex>
          {!skeleton && (
            <>
              <Box component="div" mb={2}>
                <FeatureImages />
              </Box>

              <PanelSidePadding>
                <Properties showTags={showTagsTable} key={getKey(feature)} />

                <MemberFeatures />
                {advanced && <Members />}

                <PublicTransport tags={tags} />
                <Runways />

                <FeatureOpenPlaceGuideLink />

                {editEnabled && <EditButton />}
                <EditDialog />
              </PanelSidePadding>
            </>
          )}
        </Flex>

        <PanelSidePadding>{footer}</PanelSidePadding>
      </PanelContent>
    </>
  );
};
