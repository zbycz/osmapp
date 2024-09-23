import React from 'react';
import { OsmOption } from '../types';
import MapIcon from '@mui/icons-material/Map';
import { Grid, Typography } from '@mui/material';
import { IconPart } from '../utils';
import { NextRouter } from 'next/router';

const parseType = (rawType: string) => {
  if (rawType === 'node' || rawType === 'n') {
    return 'node';
  }
  if (rawType === 'way' || rawType === 'w') {
    return 'way';
  }
  if (rawType === 'relation' || rawType === 'rel' || rawType === 'r') {
    return 'relation';
  }
};

const osmIdRegex = /\d{1,19}/;

const getOsmIdOptions = (id: number): OsmOption[] => {
  const types = ['node', 'way', 'relation'] as const;
  return types.map((type) => ({
    type: 'osm',
    osm: { type, id },
  }));
};

export const getOsmOptions = (inputValue: string): OsmOption[] => {
  const splitted = inputValue.split(/[/\s,]/);

  if (splitted.length === 1 && splitted[0].match(osmIdRegex)) {
    return getOsmIdOptions(parseInt(splitted[0]));
  }

  const type = parseType(splitted[0]);
  const idString = splitted[1];
  const id = parseInt(idString);

  if (!type || (!idString.match(osmIdRegex) && !Number.isNaN(id))) {
    return [];
  }

  return [
    {
      type: 'osm',
      osm: { type, id },
    },
  ];
};

export const renderOsm = ({ osm }: OsmOption) => (
  <>
    <IconPart>
      <MapIcon />
    </IconPart>
    <Grid item xs>
      <span style={{ fontWeight: 700 }}>
        OpenStreetMap {osm.type}/{osm.id}
      </span>
      <Typography variant="body2" color="textSecondary">
        OpenStreetMap Object
      </Typography>
    </Grid>
  </>
);

export const osmOptionSelected = ({ osm }: OsmOption, router: NextRouter) => {
  router.push(`${osm.type}/${osm.id}`);
};
