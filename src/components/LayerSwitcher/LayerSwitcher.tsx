import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {
  Box,
  Checkbox,
  IconButton,
  ListItemSecondaryAction,
  Radio,
  SwipeableDrawer,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { LayerSwitcherButton } from './LayerSwitcherButton';
import { dotToOptionalBr } from '../helpers';

const StyledList = styled(List)`
  .MuiListItemIcon-root {
    min-width: 45px;
  }

  .MuiListItem-dense {
    padding-top: 0;
    padding-bottom: 0;
  }
`;
const Spacer = styled.div`
  padding-bottom: 1.5em;
`;

interface Layer {
  type: 'basemap' | 'overlay' | 'user' | 'spacer';
  name?: string;
  url?: string;
}

const osmappLayers: Layer[] = [
  { name: 'Základní', type: 'basemap' },
  { name: 'Turistická', type: 'basemap' },
  { type: 'spacer' },
  { name: 'Mapnik', type: 'basemap' },
  { name: 'Satelitní', type: 'basemap' },
  { name: 'MTB', type: 'basemap' },
  { name: 'Cyklo', type: 'basemap' },
  { name: 'Zimní', type: 'basemap' },
  { type: 'spacer' },
  { name: 'Vrstevnice', type: 'overlay' },
  { name: 'Stínování kopců', type: 'overlay' },
  { name: 'Ikonky (POI)', type: 'overlay' },
  { name: 'Popisky', type: 'overlay' },
  { type: 'spacer' },
];

const useUserLayers = () => {
  const [layers, setLayers] = useState(
    JSON.parse(window?.localStorage.getItem('userLayers')) ?? [],
  );
  const setUserLayers = (cb) => {
    setLayers((current) => {
      const newLayers = cb(current);
      window?.localStorage.setItem('userLayers', JSON.stringify(newLayers));
      return newLayers;
    });
  };
  return [layers, setUserLayers] as [Layer[], any];
};

const Content = () => {
  const [userLayers, setUserLayers] = useUserLayers();
  const items = [...osmappLayers, ...userLayers];

  return (
    <>
      <Box m={2}>
        <Typography
          variant="h5"
          style={{ color: 'rgba(0, 0, 0, 0.7)' }}
          id="layerSwitcher-heading"
        >
          Vrstvy
        </Typography>
      </Box>

      <Box m={2}>
        <Typography variant="body2" color="textSecondary">
          OpenStreetMap je mapová databáze, proto dobrovolníci připravují
          vlastní varianty mapy pro různá užití.
        </Typography>
      </Box>

      <StyledList dense aria-labelledby="layerSwitcher-heading">
        {items.map(({ name, type, url }, index) => {
          const labelId = `checkbox-list-label-${name}`;

          if (type === 'spacer') {
            // eslint-disable-next-line react/no-array-index-key
            return <Spacer key={index} />;
          }

          return (
            // eslint-disable-next-line react/no-array-index-key
            <ListItem button key={index}>
              <ListItemIcon>
                {type === 'basemap' ? (
                  <Radio
                    size="small"
                    checked={false}
                    // onChange={handleChange}
                    value={name}
                    name="radio-button-demo"
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                ) : (
                  <Checkbox
                    size="small"
                    checked={false}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                )}
              </ListItemIcon>
              <ListItemText id={labelId} primary={dotToOptionalBr(name)} />
              {type === 'user' && (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="comments"
                    onClick={() => {
                      setUserLayers((current) =>
                        current.filter((item) => item.url !== url),
                      );
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          );
        })}
      </StyledList>
      <Box m={2}>
        <Button
          size="small"
          onClick={() => {
            // eslint-disable-next-line no-alert
            const url = prompt(
              'TMS vrstva:',
              'https://strava-heatmap.tiles.freemap.sk/all/hot/{z}/{x}/{y}.png?px=256',
            );
            if (url) {
              setUserLayers((current) => [
                ...current,
                {
                  name: url.replace(/^https?:\/\/([^/]+).*$/, '$1'),
                  url,
                  type: 'user',
                },
              ]);
            }
          }}
        >
          Přidat vlastní vrstvu
        </Button>
      </Box>
    </>
  );
};

const LayerSwitcher = () => {
  const [opened, setOpened] = React.useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event?.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpened(open);
    };

  return (
    <div>
      <LayerSwitcherButton onClick={toggleDrawer(true)} />
      <SwipeableDrawer
        anchor="right"
        open={opened}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        // variant="persistent"
        disableBackdropTransition
      >
        <div role="presentation" style={{ width: '280px', height: '100%' }}>
          <Content />
        </div>
      </SwipeableDrawer>
    </div>
  );
};

export default LayerSwitcher; // dynamic import
