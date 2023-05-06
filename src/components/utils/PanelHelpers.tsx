import React from 'react';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';
import { isDesktop, isMobile } from '../helpers';

// custom scrollbar
// better: https://github.com/rommguy/react-custom-scroll
// maybe https://github.com/malte-wessel/react-custom-scrollbars (larger)
export const PanelWrapper = styled.div`
  position: absolute;
  left: 12px;
  @media ${isMobile} {
    left: 0px;
  }
  top: 72px; // TopPanel
  @media ${isMobile} {
    top: 68px;
  }

  bottom: 12px;
  @media ${isMobile} {
    bottom: 0px;
  }
  @media ${isDesktop} {
    border-radius: 12px;
    // height: calc(100vh - 72px - 12px - 24px);
    border: 1px solid ${({ theme }) => theme.palette.divider};
  }

  background: ${({ theme }) => theme.palette.panelBackground};
  overflow: hidden;
  z-index: 1100;

  display: flex;
  flex-direction: column;
  @media ${isMobile} {
    width: 100%;
  }
  @media ${isDesktop} {
    width: 410px;
  }
`;

export const PanelScrollbars = ({ children }) => (
  <Scrollbars universal autoHide style={{ height: '100%' }}>
    {children}
  </Scrollbars>
);

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
