import IconButton from '@material-ui/core/IconButton';
import Share from '@material-ui/icons/Share';
import StarBorder from '@material-ui/icons/StarBorder';
import Directions from '@material-ui/icons/Directions';
import React from 'react';
import styled from 'styled-components';
import { useFeatureContext } from '../../utils/FeatureContext';
import { FeatureImage } from './FeatureImage';
import Maki from '../../utils/Maki';
import { hasName } from '../../../helpers/featureLabel';
import { t } from '../../../services/intl';
import { SHOW_PROTOTYPE_UI } from '../../../config';
import { Feature } from '../../../services/types';

const StyledIconButton = styled(IconButton)`
  svg {
    width: 20px;
    height: 20px;
    color: #fff;
  }
`;

const PoiType = styled.div`
  color: #fff;
  margin: 0 auto 0 15px;
  font-size: 13px;
  position: relative;
  width: 100%;
  svg {
    vertical-align: bottom;
  }
  span {
    position: absolute;
    left: 20px;
  }
`;

const getSubclass = ({ layer, osmMeta, properties }: Feature) =>
  properties.subclass?.replace(/_/g, ' ') ||
  (layer && layer.id) || // layer.id specified only when maplibre-gl skeleton displayed
  osmMeta.type;

export const ImageSection = () => {
  const { feature } = useFeatureContext();
  const { properties } = feature;

  const poiType = hasName(feature)
    ? getSubclass(feature)
    : t('featurepanel.no_name');

  return (
    <FeatureImage feature={feature} ico={properties.class}>
      <PoiType>
        <Maki ico={properties.class} invert middle />
        <span>{poiType}</span>
      </PoiType>

      {SHOW_PROTOTYPE_UI && (
        <>
          <StyledIconButton>
            <Share
              htmlColor="#fff"
              titleAccess={t('featurepanel.share_button')}
            />
          </StyledIconButton>
          <StyledIconButton>
            <StarBorder
              htmlColor="#fff"
              titleAccess={t('featurepanel.save_button')}
            />
          </StyledIconButton>
          <StyledIconButton>
            <Directions
              htmlColor="#fff"
              titleAccess={t('featurepanel.directions_button')}
            />
          </StyledIconButton>
        </>
      )}
    </FeatureImage>
  );
};
