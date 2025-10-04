import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import styled from '@emotion/styled';
import { LoginIconButton } from './LoginIconButton';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { isDesktopResolution, useMobileMode } from '../../helpers';
import { convertHexToRgba } from '../../utils/colorUtils';

const UserIconButton = styled(IconButton)`
  padding: 3px;

  @media ${isDesktopResolution} {
    background: ${({ theme }) =>
      convertHexToRgba(theme.palette.background.paper, 0.7)};
    backdrop-filter: blur(15px);

    &:hover {
      background: ${({ theme }) => theme.palette.background.paper};
    }
  }
`;

const MenuIconButton = styled(IconButton)`
  @media ${isDesktopResolution} {
    background: ${({ theme }) =>
      convertHexToRgba(theme.palette.background.paper, 0.7)};
    backdrop-filter: blur(15px);
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);

    &:hover {
      background: ${({ theme }) => theme.palette.background.paper};
    }
  }

  svg {
    fill: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const HamburgerMenuButton = ({ anchorRef, onClick }) => {
  const { osmUser } = useOsmAuthContext();
  const isMobileMode = useMobileMode();

  if (osmUser) {
    return (
      <UserIconButton ref={anchorRef} color="primary" onClick={onClick}>
        <LoginIconButton size={isMobileMode ? 32 : 36} />
      </UserIconButton>
    );
  }

  return (
    <MenuIconButton ref={anchorRef} color="primary" onClick={onClick}>
      <MenuIcon />
    </MenuIconButton>
  );
};
