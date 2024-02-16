import {
  Checkbox,
  ListItemSecondaryAction,
  Typography,
} from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import { LayerIcon, Spacer, StyledList } from './helpers';
import { Layer } from '../utils/MapStateContext';
import { dotToOptionalBr } from '../helpers';

type Props = {
  overlayLayers: Layer[];
  activeLayers: string[];
  setActiveLayers: (layers: string[] | ((prev: string[]) => string[])) => void;
};

export const Overlays = ({
  overlayLayers,
  activeLayers,
  setActiveLayers,
}: Props) => (
  <>
    <Typography
      variant="overline"
      display="block"
      color="textSecondary"
      style={{ padding: '1em 0 0 1em' }}
    >
      Overlays
    </Typography>

    <StyledList dense>
      {overlayLayers.map(({ key, name, type, Icon }) => {
        if (type === 'spacer') {
          return <Spacer key={key} />;
        }

        const isChecked = activeLayers.includes(key);
        const toggleOverlayLayer = () =>
          setActiveLayers((prev) =>
            prev.includes(key)
              ? prev.filter((layer) => layer !== key)
              : prev.concat(key),
          );

        return (
          <ListItem button onClick={toggleOverlayLayer}>
            <LayerIcon Icon={Icon} />
            <ListItemText primary={dotToOptionalBr(name)} />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                checked={isChecked}
                onClick={toggleOverlayLayer}
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </StyledList>
  </>
);
