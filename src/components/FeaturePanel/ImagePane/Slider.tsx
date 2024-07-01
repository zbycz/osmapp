import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@mui/material';
import { useScrollShadow } from '../Climbing/utils/useScrollShadow';

// from https://css-tricks.com/css-only-carousel/
const Wrapper = styled.div`
  width: 100%;
  text-align: center;
  /* overflow: hidden; */
  margin-bottom: 1rem;
  position: relative;

  .slides {
    display: flex;
    gap: 12px;
    align-items: center;
    overflow-x: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;

    padding-left: 16px;
    padding-right: 16px;

    padding-top: 16px;
    padding-bottom: 16px;
  }

  .slides > div {
    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
  }
`;

export const Slider = ({ children }) => {
  const theme = useTheme();

  const {
    scrollElementRef,
    onScroll,
    ShadowContainer,
    ShadowLeft,
    ShadowRight,
  } = useScrollShadow();

  return (
    <Wrapper>
      <ShadowContainer>
        <ShadowLeft
          backgroundColor={theme.palette.background.paper}
          gradientPercentage={7}
          opacity={0.9}
        />

        <div className="slides" onScroll={onScroll} ref={scrollElementRef}>
          {children}
        </div>
        <ShadowRight
          backgroundColor={theme.palette.background.paper}
          gradientPercentage={7}
          opacity={0.9}
        />
      </ShadowContainer>
    </Wrapper>
  );
};
