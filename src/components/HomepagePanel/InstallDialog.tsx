import React, { useEffect } from 'react';
import Router from 'next/router';
import { TabContext, TabPanel } from '@mui/lab';

import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import DesktopMacIcon from '@mui/icons-material/DesktopMac';
import styled from 'styled-components';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';
import {
  Dialog,
  Paper,
  DialogTitle,
  Tabs,
  Tab,
  DialogContent,
  Typography,
} from '@mui/material';
import { t, Translation } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { useFeatureContext } from '../utils/FeatureContext';

const isIOS = () =>
  [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod',
  ].includes(navigator.platform) ||
  // iPad on iOS 13 detection
  (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

const isAndroid = () =>
  navigator.userAgent.toLowerCase().indexOf('android') > -1;

const getPlatform = () => {
  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  return 'desktop';
};

const StyledDialog = styled(Dialog)`
  .MuiDialog-container.MuiDialog-scrollPaper {
    align-items: start;
    opacity: 1 !important; // ssr
  }
  .MuiDialogTitle-root {
    padding: 0;
  }

  ul {
    padding-left: 1em;
    margin-bottom: 2em;
  }

  li {
    position: relative;
    padding-bottom: 1em;
    font-size: 1rem;
    list-style-type: none;

    &:before {
      content: '\\2219';
      font-size: 2rem;
      line-height: 0;
      margin-left: -16px;
      position: absolute;
      margin-top: 10px;
    }

    svg {
      position: absolute;
      font-size: 18px;
      color: #777;
      margin-left: 4px;
    }
  }

  img.MuiPaper-root {
    margin-top: 0.7em;
  }

  .MuiTabPanel-root {
    padding: 0;
  }
`;

const PaperImg = ({ src, width }) => (
  <Paper
    variant="outlined"
    component="img"
    // @ts-ignore
    src={src}
    width={width}
    style={{ maxWidth: '100%' }}
  />
);

export function InstallDialog() {
  const [value, setValue] = React.useState('ios');
  const { showHomepage } = useFeatureContext();

  useEffect(() => {
    showHomepage();
    setValue(getPlatform());
  }, []);

  const handleClose = () => Router.push('/');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <StyledDialog
      open
      onClose={handleClose}
      aria-label={t('install.button')}
      disablePortal // for ssr
      BackdropProps={{
        appear: false,
      }}
    >
      <TabContext value={value}>
        <DialogTitle>
          <ClosePanelButton right onClick={handleClose} style={{ zIndex: 2 }} />
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label={t('install.tabs_aria_label')}
          >
            <Tab icon={<AppleIcon />} label="iOS" value="ios" />
            <Tab icon={<AndroidIcon />} label="Android" value="android" />
            <Tab icon={<DesktopMacIcon />} label="Desktop" value="desktop" />
          </Tabs>
        </DialogTitle>
        <DialogContent dividers>
          <TabPanel value="ios">
            <Typography paragraph color="textSecondary">
              <Translation id="install.ios_intro" />
            </Typography>
            <ul>
              <li>
                <Translation id="install.ios_share" />{' '}
                <img
                  src="/install/ios_shareicon.png"
                  srcSet="/install/ios_shareicon.png 1x, /install/ios_shareicon@2.png 2x"
                  width={16}
                  height={16}
                  alt="share icon"
                />
                <br />
                <PaperImg src="/install/ios_share.png" width={300} />
              </li>
              <li>
                <Translation id="install.ios_add" />{' '}
                <img
                  src="/install/ios_addicon.png"
                  alt="add icon"
                  width={16}
                  height={16}
                />
                <br />
                <PaperImg src="/install/ios_add.png" width={300} />
              </li>
            </ul>

            <Typography paragraph color="textPrimary">
              <Translation id="install.outro" />
            </Typography>

            <Typography paragraph color="textSecondary">
              <Translation id="install.note" />
            </Typography>
          </TabPanel>
          <TabPanel value="android">
            <Typography paragraph color="textSecondary">
              <Translation id="install.android_intro" />
            </Typography>
            <ul>
              <li>
                <Translation id="install.android_share" /> <MoreVertIcon />
                <br />
                <PaperImg src="/install/android_menu.png" width={300} />
              </li>
              <li>
                <Translation id="install.android_add" /> <AddToHomeScreenIcon />
                <br />
                <PaperImg src="/install/android_add.png" width={300} />
              </li>
            </ul>

            <Typography paragraph color="textPrimary">
              <Translation id="install.outro" />
            </Typography>

            <Typography paragraph color="textSecondary">
              <Translation id="install.note" />
            </Typography>
          </TabPanel>
          <TabPanel value="desktop">
            <Typography paragraph color="textSecondary">
              <Translation id="install.desktop_intro" />
            </Typography>
            <ul>
              <li>
                <Translation id="install.desktop_install" />{' '}
                <img
                  src="/install/desktop_add.png"
                  width={16}
                  height={16}
                  alt="add icon"
                />
                <br />
                <PaperImg src="/install/desktop_add_screen.png" width={300} />
              </li>
            </ul>

            <Typography paragraph color="textPrimary">
              <Translation id="install.outro" />
            </Typography>

            <Typography paragraph color="textSecondary">
              <Translation id="install.note" />
            </Typography>
          </TabPanel>
        </DialogContent>
      </TabContext>
    </StyledDialog>
  );
}
