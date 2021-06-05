import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {
  Box,
  IconButton,
  ListItemSecondaryAction,
  SwipeableDrawer,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import SatelliteIcon from '@material-ui/icons/Satellite';
import ExploreIcon from '@material-ui/icons/Explore';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import FilterHdrIcon from '@material-ui/icons/FilterHdr';
import MapIcon from '@material-ui/icons/Map';

import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { t } from '../../services/intl';
import { Layer, useMapStateContext } from '../utils/MapStateContext';
import { dotToOptionalBr } from '../helpers';
import { LayerSwitcherButton } from './LayerSwitcherButton';

const StyledList = styled(List)`
  .MuiListItemIcon-root {
    min-width: 45px;

    svg {
      color: #bbb;
    }
  }

  .Mui-selected {
    .MuiListItemIcon-root svg {
      color: #777;
    }
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
  basic: { name: 'Základní', type: 'basemap', icon: ExploreIcon },
  outdoor: { name: 'Outdoorová', type: 'basemap', icon: FilterHdrIcon },
  s1: { type: 'spacer' },
  mapnik: {
    name: 'OSM Mapnik',
    type: 'basemap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    icon: MapIcon,
  },
  sat: {
    name: 'Satelitní',
    type: 'basemap',
    url: 'https://api.maptiler.com/tiles/satellite/tiles.json?key=7dlhLl3hiXQ1gsth0kGu',
    icon: SatelliteIcon,
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
    icon: DirectionsBikeIcon,
  },
  // snow: {
  //   name: 'Zimní',
  //   type: 'basemap',
  //   url: 'https://www.opensnowmap.org/tiles-pistes/{z}/{x}/{y}.png',
  // },
  // s2: { type: 'spacer' },
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
    ...(userLayers.length ? [{ type: 'spacer', key: 'userSpacer' }] : []),
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
          Díky tomu, že OpenStreetMap nabízí zdrojová data, tak kdokoliv může
          vyrobit různé varianty mapy.
        </Typography>
      </Box>

      <StyledList dense aria-labelledby="layerSwitcher-heading">
        {items.map(({ key, name, type, url, icon }) => {
          if (type === 'spacer') {
            return <Spacer key={key} />;
          }

          const labelId = `checkbox-list-label-${name}`;
          const selected = activeLayers.includes(key);
          const label = selected ? (
            <>{dotToOptionalBr(name)}</>
          ) : (
            dotToOptionalBr(name)
          );

          const a = { icon: icon ?? PersonAddIcon };
          return (
            <ListItem
              button
              key={key}
              selected={selected}
              onClick={() => setActiveLayers([key])}
            >
              <ListItemIcon>
                <a.icon fontSize="small" color="textSecondary" />
              </ListItemIcon>
              <ListItemText id={labelId} primary={label} />
              <ListItemSecondaryAction>
                {!icon && (
                  <IconButton
                    edge="end"
                    aria-label="comments"
                    onClick={(e) => {
                      e.preventDefault();
                      setUserLayers((current) => {
                        if (activeLayers.includes(key)) {
                          setActiveLayers(['basic']);
                        }
                        return [...current.filter((item) => item.url !== url)];
                      });
                      return false;
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </StyledList>
      <Box m={2}>
        <Button
          size="small"
          color="secondary"
          onClick={() => {
            // eslint-disable-next-line no-alert
            const url = prompt(
              'TMS vrstva:',
              'https://osm-{s}.zby.cz/tiles_ipr_last.php/{z}/{x}/{y}.png',
            );
            if (url) {
              setUserLayers((current) => [
                ...current.filter((item) => item.url !== url),
                {
                  name: url.replace(/^https?:\/\/([^/]+).*$/, '$1'),
                  url,
                  key: url,
                  type: 'user',
                },
              ]);
              setActiveLayers([url]);
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
  const toggleDrawer = (open) => () => setOpened(open);

  return (
    <div>
      <LayerSwitcherButton onClick={toggleDrawer(true)} />
      <SwipeableDrawer
        anchor="right"
        open={opened}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        variant="persistent"
        disableBackdropTransition
      >
        <div role="presentation" style={{ width: '280px', height: '100%' }}>
          <IconButton
            aria-label={t('searchbox.close_panel')}
            onClick={toggleDrawer(false)}
            style={{ float: 'right' }}
          >
            <CloseIcon />
          </IconButton>
          <Content />
        </div>
      </SwipeableDrawer>
    </div>
  );
};

export default LayerSwitcher; // dynamic import
