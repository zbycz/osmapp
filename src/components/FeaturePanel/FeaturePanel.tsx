import React, { useState } from 'react';
import { FeatureHeading } from './FeatureHeading';
import Coordinates from './Coordinates';
import { useToggleState } from '../helpers';
import { getFullOsmappLink, getUrlOsmId } from '../../services/helpers';
import { EditDialog } from './EditDialog/EditDialog';
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
import { EditButton } from './EditButton';
import { getLabel } from '../../helpers/featureLabel';
import { ImageSection } from './ImageSection/ImageSection';
import { PublicTransport } from './PublicTransport/PublicTransport';
import { Properties } from './Properties/Properties';
import { MemberFeatures } from './MemberFeatures';
import { ClimbingPanel } from './Climbing/ClimbingPanel';
import { ClimbingContextProvider } from './Climbing/contexts/ClimbingContext';
import { isClimbingRelation } from '../../services/osmApi';
import { ParentLink } from './ParentLink';
import { ImagePane } from './ImagePane/ImagePane';

export const FeaturePanel = () => {
  const { feature } = useFeatureContext();

  const [advanced, setAdvanced] = useState(false);
  const [showAround, toggleShowAround] = useToggleState(false);
  const [showTags, toggleShowTags] = useToggleState(false);

  const { point, tags, osmMeta, skeleton, deleted } = feature;
  const editEnabled = !skeleton;
  const showTagsTable = deleted || showTags || (!skeleton && !feature.schema);

  const osmappLink = getFullOsmappLink(feature);
  const label = getLabel(feature);

  const footer = (
    <PanelFooter>
      <FeatureDescription setAdvanced={setAdvanced} />
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

  if (
    isClimbingRelation(feature) && // only for this condition is memberFeatures fetched
    feature.tags.climbing === 'crag' &&
    !advanced
  ) {
    return (
      <ClimbingContextProvider
        feature={feature}
        key={getUrlOsmId(osmMeta) + (deleted && 'del')} // TODO: hack to reset state
      >
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

          {!skeleton && (
            <>
              <PanelSidePadding>
                <ImagePane />

                <Properties
                  showTags={showTagsTable}
                  key={getUrlOsmId(osmMeta) + (deleted && 'del')}
                />

                <MemberFeatures />
                {advanced && <Members />}

                <PublicTransport tags={tags} />

                {editEnabled && (
                  <div style={{ textAlign: 'center' }}>
                    <EditButton isAddPlace={point} isUndelete={deleted} />

                    <EditDialog
                      feature={feature}
                      isAddPlace={point}
                      isUndelete={deleted}
                      key={
                        getUrlOsmId(osmMeta) + (deleted && 'del') // we need to refresh inner state
                      }
                    />
                  </div>
                )}

                {point && <ObjectsAround advanced={advanced} />}
              </PanelSidePadding>
            </>
          )}

          <PanelSidePadding>{footer}</PanelSidePadding>
        </PanelContent>
      </PanelScrollbars>
    </PanelWrapper>
  );
};
