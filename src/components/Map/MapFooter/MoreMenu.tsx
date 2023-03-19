import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import BrightnessAutoIcon from '@material-ui/icons/BrightnessAuto';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import React, { useEffect, useState } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import HelpIcon from '@material-ui/icons/Help';
import styled from 'styled-components';
import GetAppIcon from '@material-ui/icons/GetApp';
import Router from 'next/router';
import { useBoolState } from '../../helpers';
import { t } from '../../../services/intl';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useMapStateContext } from '../../utils/MapStateContext';
import { getIdEditorLink } from '../../../utils';
import { useUserThemeContext } from '../../../helpers/theme';

const StyledChevronRightIcon = styled(ChevronRightIcon)`
  margin: -2px 0px -2px -1px !important;
  font-size: 15px !important;
`;

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

const ThemeSelection = () => {
  const { userTheme, setUserTheme } = useUserThemeContext();
  const choices = {
    system: StyledBrightnessAutoIcon,
    dark: StyledBrightness4Icon,
    light: StyledBrightnessHighIcon,
  };
  const nextTheme = userTheme === 'light' ? 'dark' : 'light'; // userTheme === 'dark' ? 'light' : 'system'; //prettier-ignore
  const Icon = choices[userTheme];
  const handleClick = () => {
    setUserTheme(nextTheme);
  };
  const label = userTheme === 'system' ? 'auto' : userTheme === 'dark' ? 'on' : 'off'; // prettier-ignore
  return (
    <MenuItem onClick={handleClick}>
      <Icon />
      Dark mode: {label}
      {/* <a onClick={() => setUserTheme('dark')} style={{ fontWeight: userTheme == 'dark' ? 'bold' : 'normal' }}>Dark</a>&nbsp;/&nbsp; */}
      {/* <a onClick={() => setUserTheme('light')} style={{ fontWeight: userTheme == 'light' ? 'bold' : 'normal' }}>Light</a>&nbsp;/&nbsp; */}
      {/* <a onClick={() => setUserTheme('system')} style={{ fontWeight: userTheme == 'system' ? 'bold' : 'normal' }}>Auto</a> */}
    </MenuItem>
  );
};

// TODO maybe
//            <ListItemIcon>
//             <InboxIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText primary="Inbox" />

// TODO custom Item components are not keyboard accesible
// seems like a bug in material-ui
// https://github.com/mui-org/material-ui/issues/22912
// https://github.com/mui-org/material-ui/issues?q=is%3Aissue+is%3Aopen+menuitem+keyboard

export const MoreMenu = () => {
  const anchorRef = React.useRef();
  const [opened, open, close] = useBoolState(false);

  return (
    <>
      <Menu
        id="more-menu"
        anchorEl={anchorRef.current}
        open={opened}
        onClose={close}
      >
        <EditLink closeMenu={close} />
        <AboutLink closeMenu={close} />
        <InstallLink closeMenu={close} />
        <ThemeSelection />
      </Menu>
      <button
        type="button"
        className="linkLikeButton"
        aria-controls="more-menu"
        aria-haspopup="true"
        onClick={open}
        ref={anchorRef}
        title={t('map.more_button_title')}
      >
        {t('map.more_button')}
        <StyledChevronRightIcon />
      </button>
    </>
  );
};
