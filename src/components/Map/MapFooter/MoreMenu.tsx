import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import React, { useEffect, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import HelpIcon from '@mui/icons-material/Help';
import styled from 'styled-components';
import GetAppIcon from '@mui/icons-material/GetApp';
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
