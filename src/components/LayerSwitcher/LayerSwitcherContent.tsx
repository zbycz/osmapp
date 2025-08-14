import React from 'react';
import { PersonAdd } from '@mui/icons-material';
import { isViewInsideBbox, LayersHeader } from './helpers';
import { osmappLayers } from './osmappLayers';
import { Layer, useMapStateContext, View } from '../utils/MapStateContext';
import { Overlays } from './Overlays';
import { AddUserLayerButton } from './AddLayerButton';
import { BaseLayers } from './BaseLayers';
import { Divider } from '@mui/material';

type AllLayers = {
  basemapLayers: Layer[];
  overlayLayers: Layer[];
};

const getAllLayers = (userLayers: Layer[], view: View): AllLayers => {
  const spacer: Layer = { type: 'spacer' as const, key: 'userSpacer' };
  const toLayer = ([key, layer]) => ({ ...layer, key });

  const entries = Object.entries(osmappLayers).filter(([_, layer]) => {
    if (!layer.bboxes) return true;
    return layer.bboxes.some((b) => isViewInsideBbox(view, b));
  });
  const basemaps = entries.filter(([, v]) => v.type === 'basemap');
  const overlays = entries.filter(([, v]) => v.type.startsWith('overlay'));

  const basemapLayers = [
    ...basemaps.map(toLayer),
    ...(userLayers.length ? [spacer] : []),
    ...userLayers.map((layer) => ({
      ...layer,
      key: layer.url,
      Icon: PersonAdd,
    })),
  ];

  return {
    basemapLayers,
    overlayLayers: overlays.map(toLayer),
  };
};

export const LayerSwitcherContent = () => {
  const { view, userLayers } = useMapStateContext();
  const { basemapLayers, overlayLayers } = getAllLayers(userLayers, view);

  return (
    <>
      <LayersHeader />
      <Divider />

      <BaseLayers baseLayers={basemapLayers} />
      <Overlays overlayLayers={overlayLayers} />

      <AddUserLayerButton />
    </>
  );
};
