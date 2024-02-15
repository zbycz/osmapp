import PersonAddIcon from '@mui/icons-material/PersonAdd';

import React from 'react';
import styled from 'styled-components';

import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { dotToOptionalBr } from '../helpers';
import {
  AddUserLayerButton,
  LayerIcon,
  LayersHeader,
  RemoveUserLayerAction,
} from './helpers';
import { osmappLayers } from './osmappLayers';
import { Layer, useMapStateContext, View } from '../utils/MapStateContext';
import { usePersistedState } from '../utils/usePersistedState';
import { isViewInsideAfrica } from '../Map/styles/makinaAfricaStyle';

const StyledList = styled(List)`
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

const Spacer = styled.div`
  padding-bottom: 1.5em;
`;

const getAllLayers = (userLayers: Layer[], view: View): Layer[] => {
  const spacer: Layer = { type: 'spacer' as const, key: 'userSpacer' };
  const toLayer = ([key, layer]) => ({ ...layer, key });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filterMakina = ([key, _]) =>
    key === 'makinaAfrica' ? isViewInsideAfrica(view) : true; // needs suppressHydrationWarning

  return [
    ...Object.entries(osmappLayers).filter(filterMakina).map(toLayer),
    ...(userLayers.length ? [spacer] : []),
    ...userLayers.map((layer) => ({
      ...layer,
      key: layer.url,
      Icon: PersonAddIcon,
      type: 'user' as const,
    })),
  ];
};

export const LayerSwitcherContent = () => {
  const { view, activeLayers, setActiveLayers } = useMapStateContext();
  const [userLayers, setUserLayers] = usePersistedState('userLayers', []);
  const layers = getAllLayers(userLayers, view);

  return (
    <>
      <LayersHeader headingId="layerSwitcher-heading" />

      <StyledList
        dense
        aria-labelledby="layerSwitcher-heading"
        suppressHydrationWarning
      >
        {layers.map(({ key, name, type, url, Icon }) => {
          if (type === 'spacer') {
            return <Spacer key={key} />;
          }
          return (
            <ListItem
              button
              key={key}
              selected={activeLayers.includes(key)}
              onClick={() => setActiveLayers([key])}
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
      <AddUserLayerButton setUserLayers={setUserLayers} />
    </>
  );
};
