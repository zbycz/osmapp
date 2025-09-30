import React from 'react';
import styled from '@emotion/styled';
import { FeaturedTag } from './FeaturedTag';
import { useFeatureContext } from '../utils/FeatureContext';
import { FEATURED_KEYS } from '../../services/tagging/featuredKeys';
import uniqBy from 'lodash/uniqBy';

const Spacer = styled.div`
  padding-bottom: 10px;
`;

export const FeaturedTags = () => {
  const { feature } = useFeatureContext();

  const duplicatedKeys =
    feature.schema?.featuredTags
      .map(([k, v]) => ({
        k,
        v,
        featuredKey: FEATURED_KEYS.find(({ matcher }) => matcher.test(k)),
      }))
      .filter(({ featuredKey, v }) => featuredKey && v) ?? [];

  const keys = uniqBy(
    duplicatedKeys,
    ({ featuredKey, v, k }) =>
      `${featuredKey.renderer}-${featuredKey.uniqPredicate?.(k, v) ?? v}`,
  );

  if (!keys.length) {
    return null;
  }

  return (
    <>
      {keys.map(({ k, featuredKey }) => {
        return <FeaturedTag key={k} k={k} renderer={featuredKey.renderer} />;
      })}
      <Spacer />
    </>
  );
};
