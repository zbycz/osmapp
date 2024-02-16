import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import { ListItemSecondaryAction } from '@material-ui/core';
import { dotToOptionalBr } from '../helpers';
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
import { isViewInsideAfrica } from '../Map/styles/makinaAfricaStyle';
import { Overlays } from './Overlays';

type AllLayers = {
  basemapLayers: Layer[];
  overlayLayers: Layer[];
};

const getAllLayers = (userLayers: Layer[], view: View): AllLayers => {
  const spacer: Layer = { type: 'spacer' as const, key: 'userSpacer' };
  const toLayer = ([key, layer]) => ({ ...layer, key });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filterMakina = ([key, _]) =>
    key === 'makinaAfrica' ? isViewInsideAfrica(view) : true; // needs suppressHydrationWarning

  const entries = Object.entries(osmappLayers);
  const basemaps = entries.filter(([, v]) => v.type === 'basemap');
  const overlays = entries.filter(([, v]) => v.type === 'overlay');

  const basemapLayers = [
    ...basemaps.filter(filterMakina).map(toLayer),
    ...(userLayers.length ? [spacer] : []),
    ...userLayers.map((layer) => ({
      ...layer,
      key: layer.url,
      Icon: PersonAddIcon,
      type: 'user' as const,
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
