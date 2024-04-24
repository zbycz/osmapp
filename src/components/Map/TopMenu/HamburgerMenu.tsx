import BrightnessAutoIcon from '@material-ui/icons/BrightnessAuto';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import React, { forwardRef, useEffect, useState } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import HelpIcon from '@material-ui/icons/Help';
import styled from 'styled-components';
import GetAppIcon from '@material-ui/icons/GetApp';
import Router from 'next/router';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useBoolState } from '../../helpers';
import { t } from '../../../services/intl';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useMapStateContext } from '../../utils/MapStateContext';
import { getIdEditorLink } from '../../../utils';
import { useUserThemeContext } from '../../../helpers/theme';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { LoginIcon } from './LoginIcon';

const PencilIcon = styled(CreateIcon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

const HomeIcon = styled(HelpIcon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

const InstallIcon = styled(GetAppIcon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

const StyledBrightnessAutoIcon = styled(BrightnessAutoIcon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

const StyledBrightness4Icon = styled(Brightness4Icon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

const StyledBrightnessHighIcon = styled(BrightnessHighIcon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

const StyledAccountCircleIcon = styled(AccountCircleIcon)`
  color: ${({ theme }) => theme.palette.action.active};
  margin: -2px 6px 0 0;
  font-size: 17px !important;
`;

const StyledDivider = styled.hr`
  border-top: 1px solid ${({ theme }) => theme.palette.divider};
`;

const useIsBrowser = () => {
  // fixes hydration error - server and browser have different view (cookies and window.hash)
  // throwed "Warning: Prop `href` did not match."
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(true);
  }, []);
  return browser;
};

const EditLink = ({ closeMenu }) => {
  const browser = useIsBrowser();
  const { view } = useMapStateContext();
  const { feature } = useFeatureContext();
  const href = getIdEditorLink(feature, browser ? view : []);
  return (
    <MenuItem
      component="a"
      href={href}
      target="_blank"
      rel="noopener"
      onClick={closeMenu}
    >
      <PencilIcon />
      {t('map.edit_link')}
    </MenuItem>
  );
};

const AboutLink = ({ closeMenu }) => {
  const { persistShowHomepage, homepageShown } = useFeatureContext();
  const handleClick = () => {
    persistShowHomepage();
    closeMenu();
  };
  return (
    <MenuItem disabled={homepageShown} onClick={handleClick}>
      <HomeIcon />
      {t('map.about_link')}
    </MenuItem>
  );
};

const InstallLink = ({ closeMenu }) => {
  const handleClick = () => {
    closeMenu();
    Router.push('/install');
  };
  return (
    <MenuItem onClick={handleClick} href="/install">
      <InstallIcon />
      {t('install.button')}
    </MenuItem>
  );
};

const themeOptions = {
  system: {
    icon: StyledBrightnessAutoIcon,
    label: t('darkmode_auto'),
    next: 'dark' as const,
  },
  dark: {
    icon: StyledBrightness4Icon,
    label: t('darkmode_on'),
    next: 'light' as const,
  },
  light: {
    icon: StyledBrightnessHighIcon,
    label: t('darkmode_off'),
    next: 'system' as const,
  },
};

const ThemeSelection = () => {
  const { userTheme, setUserTheme } = useUserThemeContext();
  const option = themeOptions[userTheme];
  const handleClick = () => {
    setUserTheme(option.next);
  };

  return (
    <MenuItem onClick={handleClick}>
      <option.icon /> {option.label}
    </MenuItem>
  );
};

const UserLogin = forwardRef<HTMLLIElement, any>(({ closeMenu }, ref) => {
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
      <MenuItem ref={ref} onClick={login}>
        <StyledAccountCircleIcon />
        {t('user.login')}
      </MenuItem>
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
      <MenuItem onClick={logout}>{t('user.logout')}</MenuItem>
    </>
  );
});

// TODO custom Item components are not keyboard accesible
// seems like a bug in material-ui
// https://github.com/mui-org/material-ui/issues/22912
// https://github.com/mui-org/material-ui/issues?q=is%3Aissue+is%3Aopen+menuitem+keyboard

export const HamburgerMenu = () => {
  const anchorRef = React.useRef();
  const [opened, open, close] = useBoolState(false);

  return (
    <>
      <Menu
        id="hamburger-menu"
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        getContentAnchorEl={null}
        open={opened}
        onClose={close}
      >
        <UserLogin closeMenu={close} />
        <StyledDivider />
        <ThemeSelection />
        <EditLink closeMenu={close} />
        <InstallLink closeMenu={close} />
        <AboutLink closeMenu={close} />
      </Menu>
      <LoginIcon onClick={open} />
      <IconButton
        ref={anchorRef}
        aria-controls="hamburger-menu"
        aria-haspopup="true"
        title={t('map.more_button_title')}
        color="secondary"
        onClick={open}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
};
