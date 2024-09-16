import styled from '@emotion/styled';
import { Grid, Typography } from '@mui/material';
import React from 'react';
import maplibregl from 'maplibre-gl';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { useMapStateContext } from '../utils/MapStateContext';
import { t } from '../../services/intl';
import { getGlobalMap } from '../../services/mapStorage';
import { LonLat, MapCenter } from '../../services/types';
import { DotLoader, isImperial } from '../helpers';
import { GeocoderOption, Option } from './types';
import { buildPhotonAddress } from './options/geocoder';

export const IconPart = styled.div`
  width: 50px;
  text-align: center;
  padding-right: 10px;
  font-size: 10px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const getDistance = (point1: MapCenter, point2: MapCenter) => {
  const lat1 = (parseFloat(`${point1.lat}`) * Math.PI) / 180;
  const lng1 = (parseFloat(`${point1.lon}`) * Math.PI) / 180;
  const lat2 = (parseFloat(`${point2.lat}`) * Math.PI) / 180;
  const lng2 = (parseFloat(`${point2.lon}`) * Math.PI) / 180;
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

export const getHumanDistance = (mapCenter: MapCenter, [lon, lat]: LonLat) => {
  const distKm = getDistance(mapCenter, { lon, lat }) / 1000;
  const dist = isImperial() ? distKm * 0.621371192 : distKm;
  const rounded = dist < 10 ? Math.round(dist * 10) / 10 : Math.round(dist);
  return isImperial() ? `${rounded} mi` : `${rounded} km`;
};

export const useMapCenter = (): MapCenter => {
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
    getGlobalMap()?.flyTo({ center: coords, zoom: 17 });
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

export const getOptionLabel = (option: Option) => {
  return (
    (option.type === 'geocoder' && option.geocoder.properties?.name) ||
    (option.type === 'preset' && option.preset?.presetForSearch?.name) ||
    (option.type === 'overpass' && option.overpass?.inputValue) ||
    (option.type === 'star' && option.star.label) ||
    (option.type === 'loader' && '') ||
    (option.type === 'geocoder' &&
      option.geocoder.properties &&
      buildPhotonAddress(option.geocoder.properties)) ||
    ''
  );
};
