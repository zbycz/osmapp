import {
  Bbox,
  Layer,
  useMapStateContext,
  View,
} from '../utils/MapStateContext';
import {
  isViewInsideBbox,
  LayerIcon,
  RemoveUserLayerAction,
  Spacer,
  StyledList,
} from './helpers';
import React from 'react';
import { ListItemButton, ListItemText, Tooltip } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const OutsideOfView = () => (
  <Tooltip title="Not visible currently" arrow placement="top-end">
    <WarningIcon fontSize="small" color="secondary" />
  </Tooltip>
);

const getIsOutsideOfView = (bboxes: Bbox[], view: View) =>
  bboxes && !bboxes.some((b) => isViewInsideBbox(view, b));

const BaseLayerItem = ({ layer }: { layer: Layer }) => {
  const { view, activeLayers, setActiveLayers } = useMapStateContext();
  const { key, name, type, url, Icon, bboxes, secondLine } = layer;

  const handleClick = () => {
    setActiveLayers((prev) => [key, ...prev.slice(1)]);
  };
  const selected = activeLayers.includes(key);
  const isOutsideOfView = getIsOutsideOfView(bboxes, view);

  return (
    <>
      <ListItemButton key={key} selected={selected} onClick={handleClick}>
        <LayerIcon Icon={Icon} />
        <ListItemText
          primary={name}
          secondary={selected && secondLine ? secondLine : undefined}
        />
        {isOutsideOfView && <OutsideOfView />}
        {type === 'user' && <RemoveUserLayerAction url={url} />}
      </ListItemButton>
    </>
  );
};

export const BaseLayers = ({ baseLayers }: { baseLayers: Layer[] }) => (
  <StyledList dense suppressHydrationWarning>
    {baseLayers.map((layer) =>
      layer.type === 'spacer' ? (
        <Spacer key={layer.key} />
      ) : (
        <BaseLayerItem key={layer.key} layer={layer} />
      ),
    )}
  </StyledList>
);
