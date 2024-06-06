import React from 'react';
import styled from 'styled-components';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

import { Size } from './types';

export const FullscreenIconContainer = styled.div`
  position: absolute;
  inset: 0 0 0 0;
  font-size: 100px;
  transition: all 0.1s ease;
  visibility: hidden;
`;

const CenteredContainer = styled.div<{ imageSize: Size }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  color: #fff;
`;

const ShowFullscreenText = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

export const ShowFullscreen = ({ onClick }) => (
  <FullscreenIconContainer onClick={onClick}>
    <CenteredContainer>
      <ZoomInIcon fontSize="inherit" />
      <ShowFullscreenText>Show photo</ShowFullscreenText>
    </CenteredContainer>
  </FullscreenIconContainer>
);
