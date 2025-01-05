import React from 'react';
import {
  Checkbox,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import { LayerIcon, Spacer, StyledList } from './helpers';
import { Layer, useMapStateContext } from '../utils/MapStateContext';
import { dotToOptionalBr } from '../helpers';
import { t } from '../../services/intl';

const OverlayItem = ({ layer }: { layer: Layer }) => {
  const { activeLayers, setActiveLayers } = useMapStateContext();
  const { key, name, Icon } = layer;

  const handleClick = (e: React.MouseEvent) => {
    setActiveLayers((prev) =>
      prev.includes(key)
        ? prev.filter((layer) => layer !== key)
        : prev.concat(key),
    );
    e.stopPropagation();
  };
  const selected = activeLayers.includes(key);

  return (
    <ListItemButton onClick={handleClick} key={key}>
      <LayerIcon Icon={Icon} />
      <ListItemText primary={dotToOptionalBr(name)} />
      <ListItemSecondaryAction>
        <Checkbox edge="end" checked={selected} onClick={handleClick} />
      </ListItemSecondaryAction>
    </ListItemButton>
  );
};

type Props = {
  overlayLayers: Layer[];
};

export const Overlays = ({ overlayLayers }: Props) => (
  <>
    <Typography
      variant="overline"
      display="block"
      color="textSecondary"
      style={{ padding: '1em 0 0 1em' }}
    >
      {t('layerswitcher.overlays')}
    </Typography>

    <StyledList dense suppressHydrationWarning>
      {overlayLayers.map((layer) =>
        layer.type === 'spacer' ? (
          <Spacer key={layer.key} />
        ) : (
          <OverlayItem key={layer.key} layer={layer} />
        ),
      )}
    </StyledList>
  </>
);
