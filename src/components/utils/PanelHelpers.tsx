import React from 'react';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';
import { useTheme } from '@material-ui/core';
import { isDesktop } from '../helpers';
import { useScrollShadow } from '../FeaturePanel/Climbing/utils/useScrollShadow';

// custom scrollbar
// better: https://github.com/rommguy/react-custom-scroll
// maybe https://github.com/malte-wessel/react-custom-scrollbars (larger)
export const PanelWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 72px; // TopPanel
  bottom: 0;
  background: ${({ theme }) => theme.palette.background.paper};
  overflow: hidden;
  z-index: 1100;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  display: flex;
  flex-direction: column;

  width: 100%;
  @media ${isDesktop} {
    width: 410px;
  }

  & > div > div {
    // disable pulling panel around on mobile
    // second div due to implementation of react-custom-scrollbars
    overscroll-behavior: none;
    overscroll-behavior-y: auto;
  }
`;

export const PanelScrollbars = ({ children }) => {
  const theme = useTheme();

  // @TODO refresh on panel height first update
  const {
    scrollElementRef,
    onScroll,
    ShadowContainer,
    ShadowTop,
    ShadowBottom,
  } = useScrollShadow();

  return (
    <ShadowContainer>
      <ShadowTop backgroundColor={theme.palette.background.paper} />
      <Scrollbars
        universal
        autoHide
        style={{ height: '100%' }}
        onScroll={onScroll}
        ref={scrollElementRef}
      >
        {children}
      </Scrollbars>
      <ShadowBottom backgroundColor={theme.palette.background.paper} />
    </ShadowContainer>
  );
};

export const PanelContent = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 72px - 238px); // 100% - TopPanel - FeatureImage
  padding: 20px 15px 0 15px;
`;

export const PanelFooter = styled.div`
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-top: auto;
  padding-bottom: 15px;
  font-size: 1rem;
  line-height: 1.5;
`;
