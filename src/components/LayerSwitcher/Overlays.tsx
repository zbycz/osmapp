import React from 'react';
import {
  Checkbox,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import { LayerIcon, Spacer, StyledList } from './helpers';
import { Layer } from '../utils/MapStateContext';
import { dotToOptionalBr } from '../helpers';
import { t } from '../../services/intl';

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
      {t('layerswitcher.overlays')}
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
          <ListItemButton onClick={toggleOverlayLayer} key={key}>
            <LayerIcon Icon={Icon} />
            <ListItemText primary={dotToOptionalBr(name)} />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                checked={isChecked}
                onClick={toggleOverlayLayer}
              />
            </ListItemSecondaryAction>
          </ListItemButton>
        );
      })}
    </StyledList>
  </>
);
