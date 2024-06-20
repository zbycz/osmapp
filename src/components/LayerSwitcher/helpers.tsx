import React from 'react';
import { Box, IconButton, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import List from '@material-ui/core/List';
import styled from 'styled-components';
import { Layer, useMapStateContext } from '../utils/MapStateContext';
import { t, Translation } from '../../services/intl';
import { useAddLayerContext } from './helpers/AddLayerContext';
// eslint-disable-next-line import/no-cycle
import { AddCustomDialog } from './AddCustomLayer';

export const AddUserLayerButton = ({ setUserLayers }) => {
  const { setActiveLayers } = useMapStateContext();
  const { open } = useAddLayerContext();

  return (
    <>
      <Box m={2} mt={6}>
        <Button size="small" color="secondary" onClick={open}>
          {t('layerswitcher.add_layer_button')}
        </Button>
      </Box>

      <AddCustomDialog
        save={(layer) => {
          const { url, name, max_zoom: maxzoom, attribution, bbox } = layer;

          setUserLayers((current) => {
            const userLayersOmitSame = current.filter(
              (item) => item.url !== url,
            );

            const newLayer: Layer = {
              type: 'user',
              maxzoom,
              name,
              url,
              attribution,
              bbox,
            };

            return [...userLayersOmitSame, newLayer];
          });
          setActiveLayers([url]); // if this not found in osmappLayers, value is used as tiles URL
        }}
      />
    </>
  );
};

export const RemoveUserLayerAction = ({ url, setUserLayers }) => {
  const { activeLayers, setActiveLayers } = useMapStateContext();
  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
    <IconButton edge="end" aria-label="close" onClick={onClick}>
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
  <ListItemIcon>{Icon && <Icon fontSize="small" />}</ListItemIcon>
);

export const StyledList = styled(List)`
  .MuiListItemIcon-root {
    min-width: 45px;

    svg {
      color: ${({ theme }) => theme.palette.action.disabled}};
    }
  }

  .Mui-selected {
    .MuiListItemIcon-root svg {
      color: ${({ theme }) => theme.palette.action.active};
    }
  }
`;

export const Spacer = styled.div`
  padding-bottom: 1.5em;
`;
