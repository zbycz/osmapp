import List from '@material-ui/core/List';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import styled from 'styled-components';
import { ListItemSecondaryAction } from '@material-ui/core';
import { dotToOptionalBr } from '../helpers';
import {
  AddUserLayerButton,
  LayerIcon,
  LayersHeader,
  RemoveUserLayerAction,
  useUserLayers,
} from './helpers';
import { osmappLayers } from './osmappLayers';
import { Layer, useMapStateContext } from '../utils/MapStateContext';

const StyledList = styled(List)`
  .MuiListItemIcon-root {
    min-width: 45px;

    svg {
      color: #bbb;
    }
  }

  .Mui-selected {
    .MuiListItemIcon-root svg {
      color: #777;
    }
  }
`;

const Spacer = styled.div`
  padding-bottom: 1.5em;
`;

const getAllLayers = (userLayers: Layer[]) => {
  const spacer = { type: 'spacer', key: 'userSpacer' };
  return [
    ...Object.entries(osmappLayers).map(([key, val]) => ({ ...val, key })),
    ...(userLayers.length ? [spacer] : []),
    ...userLayers.map((layer) => ({ ...layer, Icon: PersonAddIcon })),
  ] as Layer[];
};

export const LayerSwitcherContent = () => {
  const { activeLayers, setActiveLayers } = useMapStateContext();
  const [userLayers, setUserLayers] = useUserLayers(['basic']);
  const layers = getAllLayers(userLayers);

  return (
    <>
      <LayersHeader />

      <StyledList dense aria-labelledby="layerSwitcher-heading">
        {layers.map(({ key, name, type, url, Icon }) => {
          if (type === 'spacer') return <Spacer key={key} />;
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
