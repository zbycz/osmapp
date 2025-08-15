import React from 'react';
import styled from '@emotion/styled';
import { isDesktop, useMobileMode } from '../../helpers';
import { HamburgerMenu } from './HamburgerMenu';

const Wrapper = styled.span`
  vertical-align: top;
  display: inline-block;

  margin-top: -10px;

  @media ${isDesktop} {
    margin-top: 8px;
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
