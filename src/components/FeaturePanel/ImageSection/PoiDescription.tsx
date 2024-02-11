import React from 'react';
import styled from 'styled-components';
import { getPoiType } from '../../../helpers/featureLabel';
import { useFeatureContext } from '../../utils/FeatureContext';
import Maki from '../../utils/Maki';

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
    ${({ isSkeleton }) => isSkeleton && 'opacity: 0.4;'}
  }
`;

export const PoiDescription = () => {
  const { feature } = useFeatureContext();
  const { properties } = feature;
  const poiType = getPoiType(feature);

  return (
    <PoiType isSkeleton={feature.skeleton}>
      <Maki ico={properties.class} invert middle />
      <span>{poiType}</span>
    </PoiType>
  );
};
