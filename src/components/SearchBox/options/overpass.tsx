import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Grid, Typography } from '@mui/material';
import type { OverpassOption } from '../types';
import { t } from '../../../services/intl';
import { IconPart } from '../utils';

export const getOverpassOptions = (
  inputValue: string,
): [OverpassOption] | [] => {
  if (inputValue.match(/^(op|overpass):/)) {
    return [
      {
        overpass: {
          query: inputValue.replace(/^(op|overpass):/, ''),
          label: t('searchbox.overpass_custom_query'),
          inputValue,
        },
      },
    ];
  }

  if (inputValue.match(/^[-:_a-zA-Z0-9]+=/)) {
    const [key, value] = inputValue.split('=', 2);
    return [
      {
        overpass: {
          tags: { [key]: value || '*' },
          label: `${key}=${value || '*'}`,
          inputValue,
        },
      },
    ];
  }

  return [];
};

export const renderOverpass = (overpass) => (
  <>
    <IconPart>
      <SearchIcon />
    </IconPart>
    <Grid item xs>
      <span style={{ fontWeight: 700 }}>{overpass.label}</span>
      <Typography variant="body2" color="textSecondary">
        overpass search
      </Typography>
    </Grid>
  </>
);
