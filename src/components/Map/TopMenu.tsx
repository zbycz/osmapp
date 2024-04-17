import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import styled from 'styled-components';
import { isDesktop } from '../helpers';

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
`;

export const TopMenu = () => {
  return (
    <Wrapper>
      <IconButton>
        <AccountCircleIcon />
      </IconButton>

      <IconButton>
        <MenuIcon />
      </IconButton>
    </Wrapper>
  );
};
