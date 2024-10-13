import React from 'react';
import { OsmOption } from '../types';
import MapIcon from '@mui/icons-material/Map';
import { Grid, Typography } from '@mui/material';
import { IconPart } from '../utils';
import { NextRouter } from 'next/router';
import { isUrl } from '../../../helpers/utils';

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

const osmIdRegex = /^\d{1,19}$/;

const getOsmIdOptions = (id: number): OsmOption[] =>
  ['node', 'way', 'relation'].map((type) => ({
    type: 'osm',
    osm: { type, id },
  }));

const getOsmWebsiteOptions = (inputValue: string): OsmOption | undefined => {
  if (!isUrl(inputValue)) {
    return undefined;
  }
  const { pathname } = new URL(inputValue);

  const typeMatches = pathname.match(/node|way|relation|rel/);
  const idMatches = pathname.match(osmIdRegex);

  if (!typeMatches || !idMatches) {
    return undefined;
  }

  return {
    type: 'osm',
    osm: {
      type: parseType(typeMatches[0]),
      id: parseInt(idMatches[0]),
    },
  };
};

export const getOsmOptions = (inputValue: string): OsmOption[] => {
  const urlOption = getOsmWebsiteOptions(inputValue);
  if (urlOption) {
    return [urlOption];
  }

  if (inputValue.match(osmIdRegex)) {
    return getOsmIdOptions(parseInt(inputValue));
  }

  const splitted = inputValue.split(/[/\s,]/);
  const type = parseType(splitted[0]);
  const idString = splitted[1];
  const id = parseInt(idString);

  if (!type || !idString?.match(osmIdRegex) || Number.isNaN(id)) {
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
