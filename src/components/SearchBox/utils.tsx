import styled from '@emotion/styled';
import { Grid, Typography } from '@mui/material';
import React from 'react';
import maplibregl, { LngLatLike } from 'maplibre-gl';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { useMapStateContext } from '../utils/MapStateContext';
import { t } from '../../services/intl';
import { getGlobalMap } from '../../services/mapStorage';
import { LonLat } from '../../services/types';
import { DotLoader, isImperial } from '../helpers';
import { GeocoderOption } from './types';

export const IconPart = styled.div`
  width: 50px;
  text-align: center;
  padding-right: 10px;
  font-size: 10px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const getDistance = (point1: LonLat, point2: LonLat) => {
  const latdiff = degreesToRadians(point2[1]) - degreesToRadians(point1[1]);
  const lngdiff = degreesToRadians(point2[0]) - degreesToRadians(point1[0]);

  // harvesine formula
  return (
    12745590 *
    Math.asin(
      Math.sqrt(
        Math.sin(latdiff / 2) ** 2 +
          Math.cos(degreesToRadians(point1[1])) *
            Math.cos(degreesToRadians(point2[1])) *
            Math.sin(lngdiff / 2) ** 2,
      ),
    )
  );
};

export const getHumanDistance = (mapCenter: LonLat, point: LonLat) => {
  const distKm = getDistance(mapCenter, point) / 1000;
  const dist = isImperial() ? distKm * 0.621371192 : distKm;
  const rounded = dist < 10 ? Math.round(dist * 10) / 10 : Math.round(dist);
  return isImperial() ? `${rounded} mi` : `${rounded} km`;
};

export const useMapCenter = (): LonLat => {
  const {
    view: [, lat, lon],
  } = useMapStateContext();
  return [parseFloat(lon), parseFloat(lat)];
};

export const renderLoader = () => (
  <>
    <IconPart />
    <Grid item xs>
      <Typography>
        {t('loading')}
        <DotLoader />
      </Typography>
    </Grid>
  </>
);

export const fitBounds = ({ geocoder }: GeocoderOption) => {
  // this condition is maybe not used in current API photon
  const { properties } = geocoder;
  if (properties.extent) {
    const [w, s, e, n] = properties.extent;
    const bbox = new maplibregl.LngLatBounds([w, s], [e, n]);
    const panelWidth = window.innerWidth > 700 ? 410 : 0;
    getGlobalMap()?.fitBounds(bbox, {
      padding: { top: 5, bottom: 5, right: 5, left: panelWidth + 5 },
    });
    return;
  }

  const coords = geocoder.geometry.coordinates;
  if (coords.length === 2 && coords.every((num) => !Number.isNaN(num))) {
    getGlobalMap()?.flyTo({ center: coords as LngLatLike, zoom: 17 });
  } else {
    // eslint-disable-next-line no-console
    console.warn(
      'fitBounds(): option has no extent or coordinates',
      JSON.stringify(geocoder),
    );
  }
};

export const highlightText = (resultText: string, inputValue: string) => {
  const matches = match(resultText, inputValue, {
    insideWords: true,
    findAllOccurrences: true,
  });
  const parts = parse(resultText, matches);
  return parts.map((part, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
      {part.text}
    </span>
  ));
};
