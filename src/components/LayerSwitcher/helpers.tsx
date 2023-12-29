import React from 'react';
import { Button, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ListIcon from '@mui/icons-material/List';
import { useMapStateContext } from '../utils/MapStateContext';
import { t, Translation } from '../../services/intl';

let counter = 0;
const TMS_EXAMPLES = [
  'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
];

export const AddUserLayerButton = ({ setUserLayers }) => {
  const { setActiveLayers } = useMapStateContext();
  const onClick = () => {
    const TMS_EXAMPLE = TMS_EXAMPLES[counter % TMS_EXAMPLES.length];
    counter += 1;
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

export const LayersHeader = ({ headingId }) => (
  <>
    <Box m={2}>
      <Typography variant="h5" color="textPrimary" id={headingId}>
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
  <ListIcon>{Icon && <Icon fontSize="small" />}</ListIcon>
);
