import React from 'react';
import styled from 'styled-components';

// from https://css-tricks.com/css-only-carousel/
const Wrapper = styled.div`
  width: 100%;
  text-align: center;
  overflow: hidden;
  margin-bottom: 1rem;

  .slides {
    display: flex;
    align-items: center;
    overflow-x: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;

    padding-left: 15px;
  }

  .slides > div {
    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
    margin-right: 15px;
    margin-bottom: 15px;
  }
`;

export const Slider = ({ children }) => (
  <Wrapper>
    <div className="slides">{children}</div>
  </Wrapper>
);
