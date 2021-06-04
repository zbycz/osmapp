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
import { Layer, useMapStateContext } from '../utils/MapStateContext';

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

interface Layers {
  [key: string]: Layer;
}

const retina = (window.devicePixelRatio || 1) >= 2 ? '@2x' : '';

export const osmappLayers: Layers = {
  basic: { name: 'Základní', type: 'basemap' },
  outdoor: { name: 'Outdoorová', type: 'basemap' },
  s1: { type: 'spacer' },
  mapnik: {
    name: 'OSM Mapnik',
    type: 'basemap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  sat: {
    name: 'Satelitní',
    type: 'basemap',
    url: 'https://api.maptiler.com/tiles/satellite/tiles.json?key=7dlhLl3hiXQ1gsth0kGu',
  },
  // mtb: {
  //   name: 'MTB',
  //   type: 'basemap',
  //   url: 'https://openstreetmap.cz/proxy.php/tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png', // TODO proxy
  // },
  bike: {
    name: 'Cyklo',
    type: 'basemap',
    url: `https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}${retina}.png?apikey=00291b657a5d4c91bbacb0ff096e2c25`,
  },
  // snow: {
  //   name: 'Zimní',
  //   type: 'basemap',
  //   url: 'https://www.opensnowmap.org/tiles-pistes/{z}/{x}/{y}.png',
  // },
  s2: { type: 'spacer' },
  // c: { name: 'Vrstevnice', type: 'overlay' },
  // h: { name: 'Stínování kopců', type: 'overlay' },
  // p: { name: 'Ikonky (POI)', type: 'overlay' },
  // l: { name: 'Popisky', type: 'overlay' },
  // s3: { type: 'spacer' },
};

const useUserLayers = (init) => {
  const [layers, setLayers] = useState(
    JSON.parse(window?.localStorage.getItem('userLayers')) ?? init,
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
  const { activeLayers, setActiveLayers } = useMapStateContext();
  const [userLayers, setUserLayers] = useUserLayers(['basic']);
  const items = [
    ...Object.entries(osmappLayers).map(([key, value]) => ({ ...value, key })),
    ...userLayers,
  ] as Layer[];

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
          Díky tomu, že OpenStreetMap je databáze zdrojových dat, tak existuje
          velké množství různých variant.
        </Typography>
      </Box>

      <StyledList dense aria-labelledby="layerSwitcher-heading">
        {items.map(({ key, name, type, url }) => {
          if (type === 'spacer') {
            return <Spacer key={key} />;
          }

          const labelId = `checkbox-list-label-${name}`;

          return (
            <ListItem button key={key} onClick={() => setActiveLayers([key])}>
              <ListItemIcon>
                {type === 'basemap' ? (
                  <Radio
                    size="small"
                    checked={activeLayers.includes(key)}
                    name="radio-button-demo"
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                ) : (
                  <Checkbox
                    size="small"
                    checked={activeLayers.includes(key)}
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
                    onClick={() =>
                      setUserLayers((current) =>
                        // if (activeLayers.include(current)) {  // TODO remove
                        //   setActiveLayers(['basic']);
                        // }
                        [...current.filter((item) => item.url !== url)],
                      )
                    }
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
                  key: url,
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
