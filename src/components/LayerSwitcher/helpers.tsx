import React from 'react';
import { Box, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import List from '@material-ui/core/List';
import styled from 'styled-components';
import { View, useMapStateContext } from '../utils/MapStateContext';
import { t, Translation } from '../../services/intl';

export const RemoveUserLayerAction = ({ url, setUserLayers }) => {
  const { activeLayers, setActiveLayers } = useMapStateContext();
  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
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

export const LayersHeader = ({ headingId }) => (
  <>
    <Box m={2}>
      <Typography variant="h5" color="textPrimary" id={headingId}>
        {t('layerswitcher.heading')}
      </Typography>
    </Box>

    <Box m={2}>
      <Typography variant="body2" color="textSecondary">
        <Translation id="layerswitcher.intro" />
      </Typography>
    </Box>
  </>
);

export const LayerIcon = ({ Icon }) => (
  <ListItemIcon>{Icon && <Icon fontSize="small" />}</ListItemIcon>
);

export const StyledList = styled(List)`
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

export const Spacer = styled.div`
  padding-bottom: 1.5em;
`;

export const isViewInsideBbox = ([, lat, lon]: View, bbox?: number[]) =>
  !bbox ||
  (parseFloat(lat) > bbox[1] &&
    parseFloat(lat) < bbox[3] &&
    parseFloat(lon) > bbox[0] &&
    parseFloat(lon) < bbox[2]);
