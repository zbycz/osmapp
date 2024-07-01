import React from 'react';
import { useClimbingContext } from './contexts/ClimbingContext';
import { RouteList } from './RouteList/RouteList';
import { useFeatureContext } from '../../utils/FeatureContext';
import { OsmError } from '../OsmError';
import { Properties } from '../Properties/Properties';
import { ImageSlider } from '../ImagePane/ImageSlider';
import { RouteDistribution } from './RouteDistribution';
import { getWikimediaCommonsKeys, removeFilePrefix } from './utils/photo';
import { SuggestEdit } from '../SuggestEdit';
import { PanelContent, PanelSidePadding } from '../../utils/PanelHelpers';
import { FeatureHeading } from '../FeatureHeading';
import { ParentLink } from '../ParentLink';

export const ClimbingPanel = ({ footer, showTagsTable }) => {
  const { feature } = useFeatureContext();

  const { preparePhotosAndSet } = useClimbingContext();

  const cragPhotos = getWikimediaCommonsKeys(feature.tags)
    .map((key) => feature.tags[key])
    .map(removeFilePrefix);
  preparePhotosAndSet(cragPhotos);

  return (
    <PanelContent>
      <PanelSidePadding>
        <FeatureHeading />
        <ParentLink />
      </PanelSidePadding>
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
    </PanelContent>
  );
};
