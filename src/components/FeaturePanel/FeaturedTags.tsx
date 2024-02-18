import React from 'react';
import styled from 'styled-components';
import { FeaturedTag } from './FeaturedTag';
import { useEditDialogContext } from './helpers/EditDialogContext';

const Spacer = styled.div`
  padding-bottom: 10px;
`;

export const FeaturedTags = ({ featuredTags }) => {
  const { openWithTag } = useEditDialogContext();

  if (!featuredTags.length) return null;

  return (
    <>
      {featuredTags.map(([k, v]) => (
        <FeaturedTag key={k} k={k} v={v} onEdit={openWithTag} />
      ))}
      <Spacer />
    </>
  );
};
