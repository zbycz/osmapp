import React from 'react';
import styled from 'styled-components';
import { hasName } from '../../../helpers/featureLabel';
import { useFeatureContext } from '../../utils/FeatureContext';
import { t } from '../../../services/intl';
import Maki from '../../utils/Maki';
import { Feature } from '../../../services/types';

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

const getSubclass = ({ layer, osmMeta, properties, schema }: Feature) =>
  schema?.label ||
  properties.subclass?.replace(/_/g, ' ') ||
  (layer && layer.id) || // layer.id specified only when maplibre-gl skeleton displayed
  osmMeta.type;

export const PoiDescription = () => {
  const { feature } = useFeatureContext();
  const { properties } = feature;

  const poiType = hasName(feature)
    ? getSubclass(feature)
    : t('featurepanel.no_name');

  return (
    <PoiType>
      <Maki ico={properties.class} invert middle />
      <span>{poiType}</span>
    </PoiType>
  );
};
