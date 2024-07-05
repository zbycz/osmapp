import React from 'react';
import styled from 'styled-components';

// from https://css-tricks.com/css-only-carousel/
const Wrapper = styled.div<{ $onlyOneImage: boolean }>`
  width: 100%;
  text-align: center;
  /* overflow: hidden; */
  margin-bottom: 1rem;
  position: relative;

  .slides {
    display: flex;
    gap: 8px;
    ${({ $onlyOneImage }) => $onlyOneImage && `justify-content: center;`}
    align-items: center;
    overflow-x: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;

    padding: ${({ $onlyOneImage }) => ($onlyOneImage ? '12px 0' : '12px 16px')};
  }

  .slides > div {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
`;

export const Slider = ({ children, onlyOneImage }) => (
  <Wrapper $onlyOneImage={onlyOneImage}>
    <div className="slides">{children}</div>
  </Wrapper>
);
