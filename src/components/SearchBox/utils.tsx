import styled from 'styled-components';
import { Grid, Typography } from '@mui/material';
import React from 'react';
import maplibregl from 'maplibre-gl';
import { useMapStateContext } from '../utils/MapStateContext';
import { t } from '../../services/intl';
import { getGlobalMap } from '../../services/mapStorage';

export const IconPart = styled.div`
  width: 50px;
  text-align: center;
  padding-right: 10px;
  font-size: 10px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const getDistance = (point1, point2) => {
  const lat1 = (parseFloat(point1.lat) * Math.PI) / 180;
  const lng1 = (parseFloat(point1.lon) * Math.PI) / 180;
  const lat2 = (parseFloat(point2.lat) * Math.PI) / 180;
  const lng2 = (parseFloat(point2.lon) * Math.PI) / 180;
  const latdiff = lat2 - lat1;
  const lngdiff = lng2 - lng1;

  return (
    6372795 *
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin(latdiff / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin(lngdiff / 2) ** 2,
      ),
    )
  );
};

export const useMapCenter = () => {
  const {
    view: [, lat, lon],
  } = useMapStateContext();
  return { lon, lat };
};

export const renderLoader = () => (
  <>
    <IconPart />
    <Grid item xs>
      <Typography>
        {t('loading')}
        <span className="dotloader">.</span>
        <span className="dotloader">.</span>
        <span className="dotloader">.</span>
      </Typography>
    </Grid>
  </>
);

export const fitBounds = (option, panelShown = false) => {
  if (!option.properties.extent) {
    const coords = option.geometry.coordinates;
    getGlobalMap()?.flyTo({ center: coords, zoom: 17 });
  } else {
    const [w, s, e, n] = option.properties.extent;
    const bbox = new maplibregl.LngLatBounds([w, s], [e, n]);
    const panelWidth = panelShown ? 410 : 0;
    getGlobalMap()?.fitBounds(bbox, {
      padding: { top: 5, bottom: 5, right: 5, left: panelWidth + 5 },
    });
  }
};