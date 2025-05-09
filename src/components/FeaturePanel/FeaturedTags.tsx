import React from 'react';
import styled from '@emotion/styled';
import { FeaturedTag } from './FeaturedTag';
import { useFeatureContext } from '../utils/FeatureContext';
import { FEATURED_KEYS } from '../../services/tagging/featuredKeys';

const Spacer = styled.div`
  padding-bottom: 10px;
`;

export const FeaturedTags = () => {
  const { feature } = useFeatureContext();

  const keys =
    feature.schema?.featuredTags
      .map(([k, v]) => ({
        k,
        v,
        featuredKey: FEATURED_KEYS.find(({ matcher }) => matcher.test(k)),
      }))
      .filter(({ featuredKey, v }) => featuredKey && v) ?? [];

  if (!keys.length) {
    return null;
  }

  return (
    <>
      {keys.map(({ k, v, featuredKey }) => {
        return <FeaturedTag key={k} k={k} renderer={featuredKey.renderer} />;
      })}
      <Spacer />
    </>
  );
};
