import React from 'react';
import { PersonAdd, WrongLocation } from '@mui/icons-material';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  ListItemButton,
} from '@mui/material';
import { dotToOptionalBr } from '../helpers';
import {
  LayerIcon,
  LayersHeader,
  RemoveUserLayerAction,
  Spacer,
  StyledList,
  isViewInsideBbox,
} from './helpers';
import { osmappLayers } from './osmappLayers';
import { Layer, useMapStateContext, View } from '../utils/MapStateContext';
import { Overlays } from './Overlays';
import { AddUserLayerButton } from './AddLayerButton';

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
  const { view, activeLayers, setActiveLayers, userLayers, setUserLayers } =
    useMapStateContext();
  const { basemapLayers, overlayLayers } = getAllLayers(userLayers, view);

  return (
    <>
      <LayersHeader headingId="layerSwitcher-heading" />

      <StyledList
        dense
        aria-labelledby="layerSwitcher-heading"
        suppressHydrationWarning
      >
        {basemapLayers.map(({ key, name, type, url, Icon, bboxes }) => {
          if (type === 'spacer') {
            return <Spacer key={key} />;
          }
          const setActiveBaseMap = () =>
            setActiveLayers((prev) => [key, ...prev.slice(1)]);
          const isOutsideOfView =
            bboxes && !bboxes.some((b) => isViewInsideBbox(view, b));
          return (
            <ListItemButton
              key={key}
              selected={activeLayers.includes(key)}
              onClick={setActiveBaseMap}
            >
              <LayerIcon Icon={Icon} />
              <ListItemText primary={dotToOptionalBr(name)} />

              {isOutsideOfView && (
                <Tooltip
                  title="Not visible currently"
                  arrow
                  placement="top-end"
                >
                  <WrongLocation fontSize="small" color="secondary" />
                </Tooltip>
              )}

              <ListItemSecondaryAction>
                {type === 'user' && (
                  <RemoveUserLayerAction
                    url={url}
                    setUserLayers={setUserLayers}
                  />
                )}
              </ListItemSecondaryAction>
            </ListItemButton>
          );
        })}
      </StyledList>

      <Overlays
        overlayLayers={overlayLayers}
        activeLayers={activeLayers}
        setActiveLayers={setActiveLayers}
      />

      <AddUserLayerButton />
    </>
  );
};
