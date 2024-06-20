import React from 'react';
import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Layer, useMapStateContext } from '../utils/MapStateContext';
import { t } from '../../services/intl';
import { useAddLayerContext } from './helpers/AddLayerContext';
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
