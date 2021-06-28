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
  }
  .MuiDialogTitle-root {
    padding: 0;

    button.MuiButtonBase-root:first-child {
      text-transform: initial;
    }
  }

  li {
    padding-bottom: 3em;
    font-size: 1rem;
  }

  img.MuiPaper-root {
    margin-top: 1em;
  }
`;

const PaperImg = ({ src, width }) => (
    <Paper
      elevation={2}
      component="img"
      // @ts-ignore
      src={src}
      width={width}
    />
  );

export function InstallDialog() {
  const [value, setValue] = React.useState(getPlatform());

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <StyledDialog
      open
      onClose={() => Router.push('/')}
      aria-labelledby="edit-dialog-title"
    >
      <TabContext value={value}>
        <DialogTitle id="edit-dialog-title">
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
                  src="install/ios_add.png"
                  alt="add icon"
                  width={16}
                  height={16}
                />
                <br />
                <PaperImg src="install/ios_add.png" width={300} />
              </li>
            </ul>

            <Typography paragraph color="textPrimary">
              Thats all! You may find OsmAPP at your home screen.
            </Typography>

            <Typography paragraph color="textSecondary">
              Note: OsmAPP uses PWA technology, featuring quick installation and
              no need for Google Play or Apple App Store.
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
                Tap <strong>Add to Home screen</strong> <AddToHomeScreenIcon />
                <br />
                <PaperImg src="install/android_add.png" width={300} />
              </li>
            </ul>

            <Typography paragraph color="textPrimary">
              Thats all! You may find OsmAPP at your home screen.
            </Typography>

            <Typography paragraph color="textSecondary">
              Note: OsmAPP uses PWA technology, featuring quick installation and
              no need for Google Play or Apple App Store.
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
              Thats all! You may find OsmAPP at your home screen.
            </Typography>

            <Typography paragraph color="textSecondary">
              Note: OsmAPP uses PWA technology, featuring quick installation and
              no need for Google Play or Apple App Store.
            </Typography>
          </TabPanel>
        </DialogContent>
      </TabContext>
    </StyledDialog>
  );
}
