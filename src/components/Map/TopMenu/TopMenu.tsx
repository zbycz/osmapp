import React from 'react';
import styled from 'styled-components';
import { isDesktop } from '../../helpers';
import { HamburgerMenu } from './HamburgerMenu';

const Wrapper = styled.span`
  vertical-align: top;
  display: inline-block;

  margin-top: -10px;

  @media ${isDesktop} {
    margin-top: -5px;
  }

  button:last-child {
    margin-left: -10px;
  }

  svg {
    filter: drop-shadow(0 0 2px #ffffff);
  }
`;

export const TopMenu = () => (
  <Wrapper>
    <HamburgerMenu />
  </Wrapper>
);
