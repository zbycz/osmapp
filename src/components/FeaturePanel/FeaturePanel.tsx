import React, { useState } from 'react';
import styled from 'styled-components';
import { FeatureHeading } from './FeatureHeading';
import Coordinates from './Coordinates';
import { useToggleState } from '../helpers';
import { getFullOsmappLink, getKey } from '../../services/helpers';
import {
  PanelContent,
  PanelFooter,
  PanelScrollbars,
  PanelSidePadding,
  PanelWrapper,
} from '../utils/PanelHelpers';
import { useFeatureContext } from '../utils/FeatureContext';
import { t } from '../../services/intl';
import { FeatureDescription } from './FeatureDescription';
import { ObjectsAround } from './ObjectsAround';
import { OsmError } from './OsmError';
import { Members } from './Members';
import { getLabel } from '../../helpers/featureLabel';
import { ImageSection } from './ImageSection/ImageSection';
import { PublicTransport } from './PublicTransport/PublicTransport';
import { Properties } from './Properties/Properties';
import { MemberFeatures } from './MemberFeatures';
import { ClimbingPanel } from './Climbing/ClimbingPanel';
import { ClimbingContextProvider } from './Climbing/contexts/ClimbingContext';
import { isClimbingRelation } from '../../services/osmApi';
import { ParentLink } from './ParentLink';
import { ImageSlider } from './ImagePane/ImageSlider';
import { SuggestEdit } from './SuggestEdit';

const Flex = styled.div`
  flex: 1;
`;

export const FeaturePanel = () => {
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
          checked={point || showAround}
          disabled={point}
        />{' '}
        {t('featurepanel.show_objects_around')}
      </label>
      {!point && showAround && <ObjectsAround advanced={advanced} />}
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
        <ClimbingPanel footer={footer} showTagsTable={showTagsTable} />
      </ClimbingContextProvider>
    );
  }

  return (
    <PanelWrapper>
      <PanelScrollbars>
        <ImageSection />
        <PanelContent>
          <PanelSidePadding>
            <ParentLink />
            <FeatureHeading
              deleted={deleted}
              title={label}
              editEnabled={editEnabled && !point}
            />

            <OsmError />
          </PanelSidePadding>

          <Flex>
            {!skeleton && (
              <>
                <ImageSlider />

                <PanelSidePadding>
                  <Properties showTags={showTagsTable} key={getKey(feature)} />

                  <MemberFeatures />
                  {advanced && <Members />}

                  <PublicTransport tags={tags} />

                  {editEnabled && <SuggestEdit />}

                  {point && <ObjectsAround advanced={advanced} />}
                </PanelSidePadding>
              </>
            )}
          </Flex>

          <PanelSidePadding>{footer}</PanelSidePadding>
        </PanelContent>
      </PanelScrollbars>
    </PanelWrapper>
  );
};
