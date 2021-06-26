import React from 'react';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';

// custom scrollbar
// better: https://github.com/rommguy/react-custom-scroll
// maybe https://github.com/malte-wessel/react-custom-scrollbars (larger)
export const PanelWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 72px; // TopPanel
  bottom: 0;
  background-color: #fafafa;
  overflow: hidden;
  z-index: 1100;

  display: flex;
  flex-direction: column;

  width: 100%;
  @media (min-width: 500px) {
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
  color: rgba(0, 0, 0, 0.54);
  margin-top: auto;
  padding-bottom: 15px;
  font-size: 1rem;
  line-height: 1.5;
`;
