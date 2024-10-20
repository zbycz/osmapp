import { useToggleState } from '../helpers';
import { useFeatureContext } from '../utils/FeatureContext';
import { getFullOsmappLink } from '../../services/helpers';
import { PanelFooterWrapper, PanelSidePadding } from '../utils/PanelHelpers';
import { FeatureDescription } from './FeatureDescription';
import Coordinates from './Coordinates';
import { t } from '../../services/intl';
import { ObjectsAround } from './ObjectsAround';
import React from 'react';
import { RecommendedView } from './RecommendedView';

type Props = {
  advanced: boolean;
  setAdvanced: (value: ((prevState: boolean) => boolean) | boolean) => void;
  toggleShowTags: () => void;
  showTagsTable: boolean;
};
export const FeaturePanelFooter = ({
  advanced,
  setAdvanced,
  showTagsTable,
  toggleShowTags,
}: Props) => {
  const [showAround, toggleShowAround] = useToggleState(false);
  const { feature } = useFeatureContext();
  const { point, skeleton, deleted } = feature;

  const osmappLink = getFullOsmappLink(feature);

  return (
    <PanelFooterWrapper>
      <PanelSidePadding>
        <FeatureDescription advanced={advanced} setAdvanced={setAdvanced} />
        <Coordinates />
        {feature.landmarkView && (
          <>
            <br />
            <RecommendedView />
          </>
        )}
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
      </PanelSidePadding>
    </PanelFooterWrapper>
  );
};
