import React from 'react';
import styled from '@emotion/styled';
import { FeaturedTag } from './FeaturedTag';
import { climbingTagValues } from './Climbing/utils/climbingTagValues';
import { useFeatureContext } from '../utils/FeatureContext';

const Spacer = styled.div`
  padding-bottom: 10px;
`;

export const FeaturedTags = ({ featuredTags }) => {
  const { feature } = useFeatureContext();
  if (!featuredTags.length) return null;
  const isClimbing = climbingTagValues.includes(feature.tags.climbing);
  return (
    <>
      {featuredTags.map(([k, v]) => {
        if (isClimbing && k === 'description') return null;

        return <FeaturedTag key={k} k={k} v={v} />;
      })}
      <Spacer />
    </>
  );
};
