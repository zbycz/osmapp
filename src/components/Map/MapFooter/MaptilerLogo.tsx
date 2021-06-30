import React from 'react';
import styled from 'styled-components';
import { isPanelFixedWidth } from '../../helpers';

const MaptilerLink = styled.a`
  position: absolute;
  right: 75px;
  bottom: 19px;
  z-index: 999;

  @media ${isPanelFixedWidth} {
    right: 8px;
  }
`;

export const MaptilerLogo = () => (
  <MaptilerLink href="https://www.maptiler.com" rel="noopener" target="_blank">
    <img
      src="https://api.maptiler.com/resources/logo.svg"
      alt="MapTiler logo"
    />
  </MaptilerLink>
);
