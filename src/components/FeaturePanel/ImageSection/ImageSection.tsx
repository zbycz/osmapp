import Share from '@mui/icons-material/Share';
import Directions from '@mui/icons-material/Directions';
import React from 'react';
import { useFeatureContext } from '../../utils/FeatureContext';
import { FeatureImage } from './FeatureImage';
import { t } from '../../../services/intl';
import { SHOW_PROTOTYPE_UI } from '../../../config';
import { PoiDescription } from './PoiDescription';
import { StarButton } from './StarButton';
import { StyledActionButton } from './utils';

export const ImageSection = () => {
  const { feature } = useFeatureContext();
  const { properties } = feature;

  return (
    <FeatureImage feature={feature} ico={properties.class}>
      <PoiDescription />

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

      <StarButton />

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
