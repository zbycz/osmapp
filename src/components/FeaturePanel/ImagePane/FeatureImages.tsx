import React from 'react';
import styled from '@emotion/styled';
import { useLoadImages } from './useLoadImages';
import { NoImage } from './NoImage';
import { HEIGHT, ImageSkeleton } from './helpers';
import { Gallery } from './Gallery';

export const Wrapper = styled.div`
  height: calc(${HEIGHT}px + 10px); // 10px for scrollbar
  min-height: calc(${HEIGHT}px + 10px); // otherwise it shrinks b/c of flex
  width: 100%;
`;

const StyledScrollbars = styled.div`
  width: 100%;
  height: 100%;

  white-space: nowrap;
  text-align: center; // one image centering

  display: flex;
  gap: 3px;
  overflow: hidden;
  overflow-x: auto;
  scroll-snap-type: x mandatory;

  scroll-behavior: smooth;
`;

export const Slider = ({ children }) => (
  <StyledScrollbars>{children}</StyledScrollbars>
);

export const FeatureImages = () => {
  const { loading, groups } = useLoadImages();

  if (groups.length === 0) {
    return <Wrapper>{loading ? <ImageSkeleton /> : <NoImage />}</Wrapper>;
  }

  return (
    <Wrapper>
      <Slider>
        {groups.map((group, i) => (
          <Gallery
            key={i}
            def={group.def}
            images={group.images}
            isFirst={i === 0}
          />
        ))}
      </Slider>
    </Wrapper>
  );
};
