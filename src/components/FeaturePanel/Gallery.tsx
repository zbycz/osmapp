import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@mui/material';
import { useScrollShadow } from './Climbing/utils/useScrollShadow';

const Container = styled.div`
  display: flex;
  gap: 8px;
  border-radius: 8px;
  overflow: auto;
  margin-top: 12px;
  scroll-behavior: smooth;
  scroll-snap-type: x proximity;
`;
const ImageContainer = styled.div`
  scroll-snap-align: start;
`;

const Image = styled.img`
  border-radius: 8px;
  height: 200px;
  flex: 1;
  object-fit: cover;
`;

export const Gallery = ({ images }) => {
  const theme: any = useTheme();

  const {
    scrollElementRef,
    onScroll,
    ShadowContainer,
    ShadowLeft,
    ShadowRight,
  } = useScrollShadow();

  return (
    <ShadowContainer>
      <ShadowLeft
        backgroundColor={theme.palette.background.elevation}
        gradientPercentage={7}
        opacity={0.9}
      />
      <Container onScroll={onScroll} ref={scrollElementRef}>
        {images.map((image) => (
          <ImageContainer>
            <Image src={image} />
          </ImageContainer>
        ))}
      </Container>
      <ShadowRight
        backgroundColor={theme.palette.background.elevation}
        gradientPercentage={7}
        opacity={0.9}
      />
    </ShadowContainer>
  );
};
