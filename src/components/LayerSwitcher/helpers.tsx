import React from 'react';
import styled from '@emotion/styled';
import { Box, IconButton, Typography, List, ListItemIcon } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  Layer,
  LayerIcon as LayerIconType,
  View,
  useMapStateContext,
} from '../utils/MapStateContext';
import { t, Translation } from '../../services/intl';
import { Setter } from '../../types';

type RemoveUserLayerActionProps = {
  url: string;
};

export const RemoveUserLayerAction = ({ url }: RemoveUserLayerActionProps) => {
  const { activeLayers, setActiveLayers, setUserLayers } = useMapStateContext();

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setUserLayers((current) => {
      if (activeLayers.includes(url)) {
        setActiveLayers(['basic']);
      }
      return [...current.filter((item) => item.url !== url)];
    });
    return false;
  };

  return (
    <IconButton edge="end" aria-label="close" onClick={onClick}>
      <CloseIcon fontSize="small" />
    </IconButton>
  );
};

export const LayersHeader = () => (
  <>
    <Box m={2}>
      <Typography variant="h5" color="textPrimary">
        {t('layerswitcher.heading')}
      </Typography>
    </Box>

    <Box m={2} sx={{ paddingRight: 'var(--safe-right)' }}>
      <Typography variant="body2" color="textSecondary">
        <Translation id="layerswitcher.intro" />
      </Typography>
    </Box>
  </>
);

export const LayerIcon = ({ Icon }: { Icon: LayerIconType }) => (
  <ListItemIcon>{Icon && <Icon fontSize="small" />}</ListItemIcon>
);

export const StyledList = styled(List)`
  .MuiListItemIcon-root {
    min-width: 45px;

    svg {
      color: ${({ theme }) => theme.palette.action.disabled};
    }
  }

  .Mui-selected {
    .MuiListItemIcon-root svg {
      color: ${({ theme }) => theme.palette.action.active};
    }
  }
`;

export const Spacer = styled.div`
  padding-bottom: 1.5em;
`;

export const isViewInsideBbox = ([, lat, lon]: View, bbox?: number[]) =>
  !bbox ||
  (parseFloat(lat) > bbox[1] &&
    parseFloat(lat) < bbox[3] &&
    parseFloat(lon) > bbox[0] &&
    parseFloat(lon) < bbox[2]);

/**
 * Is a string a valid url for a layer
 * It must be a valid url and include all of `{x}`, `{y}` and `{zoom}` or `{z}`
 */
export const isValidLayerUrl = (url: string, isFinal: boolean) => {
  if (isFinal) {
    try {
      new URL(url);
    } catch {
      return false;
    }
  }

  const sanitizedUrl = url.replace('{zoom}', '{z}');

  const includesxyz =
    sanitizedUrl.includes('{x}') &&
    sanitizedUrl.includes('{y}') &&
    sanitizedUrl.includes('{z}');

  return includesxyz || sanitizedUrl.includes('{bbox-epsg-3857}');
};
