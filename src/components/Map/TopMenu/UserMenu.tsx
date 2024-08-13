import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { forwardRef, useState } from 'react';
import { Divider, Menu, MenuItem } from '@mui/material';
import styled from '@emotion/styled';
import Router from 'next/router';
import { useBoolState } from '../../helpers';
import { t } from '../../../services/intl';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { LoginIconButton } from './LoginIconButton';
import { UserSettingsDialog } from '../../HomepagePanel/UserSettingsDialog';
import { useMapStateContext } from '../../utils/MapStateContext';
import { PROJECT_ID } from '../../../services/project';

const StyledAccountCircleIcon = styled(AccountCircleIcon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

type UserLoginProps = {
  closeMenu: () => void;
  children?: React.ReactNode;
};

type MyTicksMenuItemProps = {
  closeMenu: () => void;
};

const MyTicksMenuItem = ({ closeMenu }: MyTicksMenuItemProps) => {
  const openMyTicks = () => {
    Router.push(`/my-ticks`);
    closeMenu();
  };

  return <MenuItem onClick={openMyTicks}>{t('user.my_ticks')}</MenuItem>;
};
const UserSettingsItem = ({ closeMenu }) => {
  const [isUserSettingsOpened, setIsUserSettingsOpened] =
    useState<boolean>(false);

  const openUserSettings = () => {
    setIsUserSettingsOpened(true);
  };

  const closeUserSettings = () => {
    setIsUserSettingsOpened(false);
    closeMenu();
  };

  return (
    <>
      <UserSettingsDialog
        isOpened={isUserSettingsOpened}
        onClose={closeUserSettings}
      />
      <MenuItem onClick={openUserSettings}>{t('user.user_settings')}</MenuItem>
    </>
  );
};

const UserLogin = forwardRef<SVGSVGElement, UserLoginProps>(
  ({ closeMenu, children }, ref) => {
    const { osmUser, handleLogin, handleLogout } = useOsmAuthContext();
    const login = () => {
      closeMenu();
      handleLogin();
    };
    const logout = () => {
      closeMenu();
      setTimeout(() => {
        handleLogout();
      }, 100);
    };

    if (!osmUser) {
      return (
        <>
          <MenuItem onClick={login}>
            <StyledAccountCircleIcon ref={ref} />
            {t('user.login_register')}
          </MenuItem>
          <Divider />
          {children}
        </>
      );
    }

    return (
      <>
        <MenuItem
          component="a"
          href={`https://www.openstreetmap.org/user/${osmUser}`}
          target="_blank"
          rel="noopener"
          onClick={closeMenu}
        >
          <StyledAccountCircleIcon ref={ref} />
          <strong>{osmUser}</strong>
        </MenuItem>
        {children}
        <Divider />
        <MenuItem onClick={logout}>{t('user.logout')}</MenuItem>
      </>
    );
  },
);

// TODO custom Item components are not keyboard accesible
// seems like a bug in material-ui
// https://github.com/mui-org/material-ui/issues/22912
// https://github.com/mui-org/material-ui/issues?q=is%3Aissue+is%3Aopen+menuitem+keyboard

export const UserMenu = () => {
  const anchorRef = React.useRef();
  const [opened, open, close] = useBoolState(false);
  const { activeLayers } = useMapStateContext();
  const hasClimbingLayer = activeLayers.includes('climbing');
  return (
    <>
      <Menu
        id="login-menu"
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={opened}
        onClose={close}
      >
        <UserLogin closeMenu={close}>
          {(hasClimbingLayer || PROJECT_ID === 'openclimbing') && (
            <MyTicksMenuItem closeMenu={close} />
          )}
          <UserSettingsItem closeMenu={close} />
        </UserLogin>
      </Menu>
      <LoginIconButton anchorRef={anchorRef} onClick={open} />
    </>
  );
};
