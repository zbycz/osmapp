import React from 'react';
import styled from 'styled-components';
import { getSubclass, hasName } from "../../../helpers/featureLabel";
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
