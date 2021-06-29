import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import Router from 'next/router';
import { TabContext, TabPanel } from '@material-ui/lab';

import AppleIcon from '@material-ui/icons/Apple';
import AndroidIcon from '@material-ui/icons/Android';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import styled from 'styled-components';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddToHomeScreenIcon from '@material-ui/icons/AddToHomeScreen';
import { isServer } from '../helpers';
import { t } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';

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
  if (isServer() || isIOS()) return 'ios';
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
  const [value, setValue] = React.useState(getPlatform());

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
            aria-label="Choose your platform"
          >
            <Tab icon={<AppleIcon />} label="iOS" value="ios" />
            <Tab icon={<AndroidIcon />} label="Android" value="android" />
            <Tab icon={<DesktopMacIcon />} label="Desktop" value="desktop" />
          </Tabs>
        </DialogTitle>
        <DialogContent dividers>
          <TabPanel value="ios">
            <Typography paragraph color="textSecondary">
              Open osmapp.org in the <strong>Safari browser</strong>
            </Typography>
            <ul>
              <li>
                Tap <strong>Share icon</strong>{' '}
                <img
                  src="install/ios_shareicon.png"
                  srcSet="install/ios_shareicon.png 1x, install/ios_shareicon@2.png 2x"
                  width={16}
                  height={16}
                  alt="share icon"
                />
                <br />
                <PaperImg src="install/ios_share.png" width={300} />
              </li>
              <li>
                Tap <strong>Add to Home Screen</strong>{' '}
                <img
                  src="install/ios_addicon.png"
                  alt="add icon"
                  width={16}
                  height={16}
                />
                <br />
                <PaperImg src="install/ios_add.png" width={300} />
              </li>
            </ul>

            <Typography paragraph color="textPrimary">
              Thats all! Look for OsmAPP at your home screen.
            </Typography>

            <Typography paragraph color="textSecondary">
              Note: This app uses PWA technology – featuring quick installation
              and no need for Google Play or App Store.
            </Typography>
          </TabPanel>
          <TabPanel value="android">
            <Typography paragraph color="textSecondary">
              Open osmapp.org in the <strong>Chrome browser</strong>
            </Typography>
            <ul>
              <li>
                Tap the <strong>three dots menu</strong> <MoreVertIcon />
                <br />
                <PaperImg src="install/android_menu.png" width={300} />
              </li>
              <li>
                Tap <strong>Install app</strong> <AddToHomeScreenIcon />
                <br />
                <PaperImg src="install/android_add.png" width={300} />
              </li>
            </ul>

            <Typography paragraph color="textPrimary">
              Thats all! Look for OsmAPP at your home screen.
            </Typography>

            <Typography paragraph color="textSecondary">
              Note: This app uses PWA technology – featuring quick installation
              and no need for Google Play or App Store.
            </Typography>
          </TabPanel>
          <TabPanel value="desktop">
            <Typography paragraph color="textSecondary">
              Open osmapp.org in <strong>Chrome</strong>,{' '}
              <strong>FirefoxOS</strong> or <strong>Opera</strong>
            </Typography>
            <ul>
              <li>
                Click the <strong>install button</strong>{' '}
                <img
                  src="install/desktop_add.png"
                  width={16}
                  height={16}
                  alt="add icon"
                />
                <br />
                <PaperImg src="install/desktop_add_screen.png" width={300} />
              </li>
            </ul>

            <Typography paragraph color="textPrimary">
              Thats all! Look for OsmAPP at your home screen.
            </Typography>

            <Typography paragraph color="textSecondary">
              Note: This app uses PWA technology – featuring quick installation
              and no need for Google Play or App Store.
            </Typography>
          </TabPanel>
        </DialogContent>
      </TabContext>
    </StyledDialog>
  );
}
