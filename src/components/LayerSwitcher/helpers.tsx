import React from 'react';
import { Box, IconButton, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useMapStateContext } from '../utils/MapStateContext';

export const AddUserLayerButton = ({ setUserLayers }) => {
  const { setActiveLayers } = useMapStateContext();
  return (
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
  );
};

export const RemoveUserLayerAction = ({ url, setUserLayers }) => {
  const { activeLayers, setActiveLayers } = useMapStateContext();
  return (
    <IconButton
      edge="end"
      aria-label="comments"
      onClick={(e) => {
        e.preventDefault();
        setUserLayers((current) => {
          if (activeLayers.includes(url)) {
            setActiveLayers(['basic']);
          }
          return [...current.filter((item) => item.url !== url)];
        });
        return false;
      }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
};

export const LayersHeader = () => (
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
  </>
);

export const LayerIcon = ({ Icon }) => (
  <ListItemIcon>{Icon && <Icon fontSize="small" />}</ListItemIcon>
);
