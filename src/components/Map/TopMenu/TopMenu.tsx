import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import React from 'react';
import styled from 'styled-components';
import { isDesktop } from '../../helpers';
import { HamburgerMenu } from './HamburgerMenu';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { Button } from '@material-ui/core';

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

const LoginIcon = () => {
  const { osmUser, handleLogin, handleLogout } = useOsmAuthContext();

  if (osmUser) {
    return (
      <Button color="secondary" onClick={handleLogout}>
        {osmUser}
      </Button>
    );
  }

  return (
    <IconButton color="secondary" onClick={handleLogin}>
      <AccountCircleIcon />
    </IconButton>
  );
};

export const TopMenu = () => (
  <Wrapper>
    <LoginIcon />

    <HamburgerMenu />
  </Wrapper>
);
