import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import { ListItemSecondaryAction } from '@material-ui/core';
import { dotToOptionalBr } from '../helpers';
// eslint-disable-next-line import/no-cycle
import {
  AddUserLayerButton,
  LayerIcon,
  LayersHeader,
  RemoveUserLayerAction,
  Spacer,
  StyledList,
} from './helpers';
import { osmappLayers } from './osmappLayers';
import { Layer, useMapStateContext, View } from '../utils/MapStateContext';
import { usePersistedState } from '../utils/usePersistedState';
// eslint-disable-next-line import/no-cycle
import { Overlays } from './Overlays';

export const isViewInsideBbox = ([, lat, lon]: View, bbox?: number[]) =>
  !bbox ||
  (parseFloat(lat) > bbox[1] &&
    parseFloat(lat) < bbox[3] &&
    parseFloat(lon) > bbox[0] &&
    parseFloat(lon) < bbox[2]);

type AllLayers = {
  basemapLayers: Layer[];
  overlayLayers: Layer[];
};

const getAllLayers = (userLayers: Layer[], view: View): AllLayers => {
  const spacer: Layer = { type: 'spacer' as const, key: 'userSpacer' };
  const toLayer = ([key, layer]) => ({ ...layer, key });
  const filterByBBox = ([, layer]: [unknown, Layer]) =>
    isViewInsideBbox(view, layer.bbox as number[]); // needs suppressHydrationWarning

  const entries = Object.entries(osmappLayers).filter(filterByBBox);
  const basemaps = entries.filter(([, v]) => v.type === 'basemap');
  const overlays = entries.filter(([, v]) => v.type.startsWith('overlay'));

  const basemapLayers = [
    ...basemaps.map(toLayer),
    ...(userLayers.length ? [spacer] : []),
    ...userLayers
      .filter(({ bbox }) => {
        if (!bbox) return true;
        return (bbox as number[][]).some((b) => isViewInsideBbox(view, b));
      })
      .map((layer) => ({
        ...layer,
        key: layer.url,
        Icon: PersonAddIcon,
      })),
  ];

  return {
    basemapLayers,
    overlayLayers: overlays.map(toLayer),
  };
};

export const LayerSwitcherContent = () => {
  const { view, activeLayers, setActiveLayers } = useMapStateContext();
  const [userLayers, setUserLayers] = usePersistedState('userLayers', []);
  const { basemapLayers, overlayLayers } = getAllLayers(userLayers, view);

  return (
    <>
      <LayersHeader headingId="layerSwitcher-heading" />

      <StyledList
        dense
        aria-labelledby="layerSwitcher-heading"
        suppressHydrationWarning
      >
        {basemapLayers.map(({ key, name, type, url, Icon }) => {
          if (type === 'spacer') {
            return <Spacer key={key} />;
          }
          const setActiveBaseMap = () =>
            setActiveLayers((prev) => [key, ...prev.slice(1)]);
          return (
            <ListItem
              button
              key={key}
              selected={activeLayers.includes(key)}
              onClick={setActiveBaseMap}
            >
              <LayerIcon Icon={Icon} />
              <ListItemText primary={dotToOptionalBr(name)} />
              <ListItemSecondaryAction>
                {type === 'user' && (
                  <RemoveUserLayerAction
                    url={url}
                    setUserLayers={setUserLayers}
                  />
                )}
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </StyledList>

      <Overlays
        overlayLayers={overlayLayers}
        activeLayers={activeLayers}
        setActiveLayers={setActiveLayers}
      />

      <AddUserLayerButton setUserLayers={setUserLayers} />
    </>
  );
};
