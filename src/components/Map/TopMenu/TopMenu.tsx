import React from 'react';
import styled from 'styled-components';
import { isDesktop } from '../../helpers';
import { HamburgerMenu } from './HamburgerMenu';
import { LoginMenu } from './LoginMenu';

const Wrapper = styled.span`
  vertical-align: top;
  display: inline-block;

  margin-top: -10px;

  @media ${isDesktop} {
    margin-top: -5px;
  }
`;

export const TopMenu = () => (
  <Wrapper>
    <LoginMenu />
    <HamburgerMenu />
  </Wrapper>
);
