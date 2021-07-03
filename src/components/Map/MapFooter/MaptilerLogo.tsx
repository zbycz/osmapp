import React from 'react';
import styled from 'styled-components';

const Link = styled.a`
  position: absolute;
  right: 8px;
  bottom: 19px;
  z-index: 999;
`;

export const MaptilerLogo = () => (
  <Link href="https://www.maptiler.com" rel="noopener" target="_blank">
    <img
      src="/logo/maptiler-api.svg"
      alt="MapTiler logo"
      width={67}
      height={20}
    />
  </Link>
);
