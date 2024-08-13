import React from 'react';
import styled from '@emotion/styled';
import { Scrollbars } from 'react-custom-scrollbars';
import { Image } from './Image/Image';
import { useLoadImages } from './useLoadImages';
import { NoImage } from './NoImage';
import { HEIGHT, ImageSkeleton } from './helpers';

const SizeWrapper = styled.div`
  width: 100%;
  height: calc(${HEIGHT}px + 10px); // 10px for scrollbar
  min-height: calc(${HEIGHT}px + 10px); // otherwise it shrinks b/c of flex
`;

const StyledScrollbars = styled(Scrollbars)`
  width: 100%;
  height: 100%;
  white-space: nowrap;
  text-align: center; // one image centering

  overflow-y: hidden;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
`;
const Slider = ({ children }) => (
  <StyledScrollbars universal autoHide>
    {children}
  </StyledScrollbars>
);

export const FeatureImages = () => {
  const { loading, images } = useLoadImages();

  if (images.length === 0) {
    return (
      <SizeWrapper>{loading ? <ImageSkeleton /> : <NoImage />}</SizeWrapper>
    );
  }

  return (
    <SizeWrapper>
      <Slider>
        {images.map((item) => (
          <Image key={item.image.imageUrl} def={item.def} image={item.image} />
        ))}
      </Slider>
    </SizeWrapper>
  );
};
