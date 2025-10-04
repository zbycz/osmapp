import React from 'react';
import styled from '@emotion/styled';
import { isDesktop, useMobileMode } from '../../helpers';
import { HamburgerMenu } from './HamburgerMenu';

const Wrapper = styled.span`
  vertical-align: top;
  display: none; // we hide it on mobile by mediaquery, so it don't jump

  margin-top: -10px;

  @media ${isDesktop} {
    display: inline-block;
    margin-top: 5px;
  }
`;

export const TopMenu = () => {
  const isMobileMode = useMobileMode();

  if (isMobileMode) return null;

  return (
    <Wrapper>
      <HamburgerMenu />
    </Wrapper>
  );
};
