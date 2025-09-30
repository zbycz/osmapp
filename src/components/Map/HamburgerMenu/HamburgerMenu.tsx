import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Tooltip,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import HelpIcon from '@mui/icons-material/Help';
import styled from '@emotion/styled';
import GetAppIcon from '@mui/icons-material/GetApp';
import Router from 'next/router';
import { useBoolState } from '../../helpers';
import { t } from '../../../services/intl';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useMapStateContext } from '../../utils/MapStateContext';
import { getIdEditorLink } from '../../FeaturePanel/helpers/externalLinks';
import { UserTheme, useUserThemeContext } from '../../../helpers/theme';
import GithubIcon from '../../../assets/GithubIcon';
import { LangSwitcher } from './LangSwitcher';
import { HamburgerIconButton } from './HamburgerIconButton';
import { PROJECT_ID } from '../../../services/project';
import ViewListIcon from '@mui/icons-material/ViewList';
import Link from 'next/link';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { UserHeader } from './UserMenu';
import { MyTicksMenuItem } from './MyTicksMenuItem';
import ContrastIcon from '@mui/icons-material/Contrast';

const StyledGithubIcon = styled(GithubIcon)`
  filter: ${({ theme }) => theme.palette.invertFilter};
`;

const useIsBrowser = () => {
  // fixes hydrationStyledDivider error - server and browser have different view (cookies and window.hash)
  // throwed "Warning: Prop `href` did not match."
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(true);
  }, []);
  return browser;
};

const EditLink = () => {
  const browser = useIsBrowser();
  const { view } = useMapStateContext();
  const { feature } = useFeatureContext();
  const href = getIdEditorLink(feature, browser ? view : undefined);
  return (
    <MenuItem component="a" href={href} target="_blank">
      <ListItemIcon>
        <CreateIcon />
      </ListItemIcon>
      <ListItemText>{t('map.edit_link')}</ListItemText>
    </MenuItem>
  );
};

const AboutLink = ({ closeMenu }) => {
  const { persistShowHomepage } = useFeatureContext();
  const handleClick = () => {
    persistShowHomepage();
    closeMenu();
  };
  return (
    <MenuItem onClick={handleClick} title={process.env.sentryRelease}>
      <ListItemIcon>
        <HelpIcon />
      </ListItemIcon>
      <ListItemText>{t('map.about_link')}</ListItemText>
    </MenuItem>
  );
};
const GithubLink = () => (
  <Tooltip title={t('map.github_title')}>
    <IconButton
      href="https://github.com/zbycz/osmapp"
      component="a"
      target="_blank"
    >
      <StyledGithubIcon width={22} height={22} />
    </IconButton>
  </Tooltip>
);
const ClimbingForumLink = () => (
  <MenuItem
    href="https://community.openclimbing.org"
    component={Link}
    target="_blank"
  >
    <ListItemIcon>
      <QuestionAnswerIcon />
    </ListItemIcon>
    <ListItemText>{t('climbing.forum')} </ListItemText>
  </MenuItem>
);
const ClimbingGradesTableLink = ({ closeMenu }) => (
  <MenuItem href="/climbing-grades" component={Link} onClick={closeMenu}>
    <ListItemIcon>
      <ViewListIcon />
    </ListItemIcon>
    <ListItemText>{t('climbing_grade_table.title')}</ListItemText>
  </MenuItem>
);

const InstallLink = () => {
  const handleClick = () => {
    Router.push('/install');
  };
  return (
    <MenuItem onClick={handleClick} href="/install">
      <ListItemIcon>
        <GetAppIcon />
      </ListItemIcon>
      <ListItemText>{t('install.button')}</ListItemText>
    </MenuItem>
  );
};
const themeOptions = {
  system: {
    icon: ContrastIcon,
    label: t('darkmode_auto'),
    next: 'dark' as UserTheme,
  },
  dark: {
    icon: DarkModeIcon,
    label: t('darkmode_on'),
    next: 'light' as UserTheme,
  },
  light: {
    icon: LightModeIcon,
    label: t('darkmode_off'),
    next: 'system' as UserTheme,
  },
};

const ThemeSelection = () => {
  const { userTheme, setUserTheme } = useUserThemeContext();
  const option = themeOptions[userTheme];
  const handleClick = () => {
    setUserTheme(option.next);
  };

  return (
    <Tooltip title={option.label}>
      <IconButton onClick={handleClick}>
        <option.icon />
      </IconButton>
    </Tooltip>
  );
};

// TODO custom Item components are not keyboard accesible
// seems like a bug in material-ui
// https://github.com/mui-org/material-ui/issues/22912
// https://github.com/mui-org/material-ui/issues?q=is%3Aissue+is%3Aopen+menuitem+keyboard

export const HamburgerMenu = () => {
  const anchorRef = useRef();
  const [opened, open, close] = useBoolState(false);
  const isOpenClimbing = PROJECT_ID === 'openclimbing';
  const { activeLayers } = useMapStateContext();
  const hasClimbingLayer = activeLayers.includes('climbing');
  return (
    <>
      <Drawer open={opened} onClose={close} anchor="right">
        <Stack direction="column" justifyContent="space-between" height="100%">
          <div>
            <UserHeader closeMenu={close} />
            <Divider sx={{ mt: 1, mb: 2 }} />
            {(hasClimbingLayer || PROJECT_ID === 'openclimbing') && (
              <MyTicksMenuItem closeMenu={close} />
            )}
            {isOpenClimbing && <ClimbingGradesTableLink closeMenu={close} />}
          </div>
          <div>
            <AboutLink closeMenu={close} />
            <InstallLink />
            <Divider />
            <Box mb={2}>
              <ClimbingForumLink />
              <EditLink />
            </Box>
            <Divider />
            <Stack direction="row" justifyContent="space-between" mb={1} mt={1}>
              <LangSwitcher />
              <div>
                <ThemeSelection />
                <GithubLink />
              </div>
            </Stack>
          </div>
        </Stack>
      </Drawer>

      <HamburgerIconButton anchorRef={anchorRef} onClick={open} />
    </>
  );
};
