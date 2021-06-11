import React from 'react';
import { Box, IconButton, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useMapStateContext } from '../utils/MapStateContext';
import { t, Translation } from '../../services/intl';

const TMS_EXAMPLE = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';

export const AddUserLayerButton = ({ setUserLayers }) => {
  const { setActiveLayers } = useMapStateContext();
  const onClick = () => {
    const url = prompt(t('layerswitcher.add_layer_prompt'), TMS_EXAMPLE); // eslint-disable-line no-alert
    if (!url) {
      return;
    }
    setUserLayers((current) => {
      const userLayersOmitSame = current.filter((item) => item.url !== url);
      return [
        ...userLayersOmitSame,
        {
          name: url.replace(/^https?:\/\/([^/]+).*$/, '$1'),
          url,
        },
      ];
    });
    setActiveLayers([url]); // if this not found in osmappLayers, value is used as tiles URL
  };

  return (
    <Box m={2}>
      <Button size="small" color="secondary" onClick={onClick}>
        {t('layerswitcher.add_layer_button')}
      </Button>
    </Box>
  );
};

export const RemoveUserLayerAction = ({ url, setUserLayers }) => {
  const { activeLayers, setActiveLayers } = useMapStateContext();
  const onClick = (e) => {
    e.preventDefault();
    setUserLayers((current) => {
      if (activeLayers.includes(url)) {
        setActiveLayers(['basic']);
      }
      return [...current.filter((item) => item.url !== url)];
    });
    return false;
  };

  return (
    <IconButton edge="end" aria-label="comments" onClick={onClick}>
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
        {t('layerswitcher.heading')}
      </Typography>
    </Box>

    <Box m={2}>
      <Typography variant="body2" color="textSecondary">
        <Translation id="layerswitcher.intro" />
      </Typography>
    </Box>
  </>
);

export const LayerIcon = ({ Icon }) => (
  <ListItemIcon>{Icon && <Icon fontSize="small" />}</ListItemIcon>
);
