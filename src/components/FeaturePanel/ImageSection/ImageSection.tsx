import Share from '@material-ui/icons/Share';
import Directions from '@material-ui/icons/Directions';
import React from 'react';
import { useFeatureContext } from '../../utils/FeatureContext';
import { FeatureImage } from './FeatureImage';
import { t } from '../../../services/intl';
import { SHOW_PROTOTYPE_UI } from '../../../config';
import { PoiDescriptionDark } from './PoiDescription';
import { StarButtonDark } from './StarButton';
import { StyledActionButton } from './utils';

export const ImageSection = () => {
  const { feature } = useFeatureContext();
  const { properties } = feature;

  return (
    <FeatureImage feature={feature} ico={properties.class}>
      <PoiDescriptionDark />

      {SHOW_PROTOTYPE_UI && (
        <>
          <StyledActionButton>
            <Share
              htmlColor="#fff"
              titleAccess={t('featurepanel.share_button')}
            />
          </StyledActionButton>
        </>
      )}

      <StarButtonDark />

      {SHOW_PROTOTYPE_UI && (
        <>
          <StyledActionButton>
            <Directions
              htmlColor="#fff"
              titleAccess={t('featurepanel.directions_button')}
            />
          </StyledActionButton>
        </>
      )}
    </FeatureImage>
  );
};
