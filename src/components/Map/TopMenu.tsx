import { isDesktop, useMobileMode } from "../helpers";
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.span`
  vertical-align: top;
  display: inline-block;

  margin-top: -10px;
  padding-right: 0;

  @media ${isDesktop} {
    margin-top: 0;
    padding-right: 5px;
  }
`;

export const TopMenu = () => {
  const isDesktopSize = !useMobileMode();

  return (
    <Wrapper>
      {isDesktopSize && (
        <IconButton>
          <AccountCircleIcon />
        </IconButton>
      )}

      <IconButton>
        <MenuIcon />
      </IconButton>
    </Wrapper>
  );
};
