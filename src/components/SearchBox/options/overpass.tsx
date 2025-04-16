import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Grid, Typography } from '@mui/material';
import { GeocoderOption, OverpassOption } from '../types';
import { t } from '../../../services/intl';
import { IconPart } from '../utils';
import { getAST, queryWizardLabel } from '../queryWizard/queryWizard';

const OVERPASS_HISTORY_KEY = 'overpassQueryHistory';

// TODO use usePersistedState with global context triggering changes
const getOverpassQueryHistory = (): string[] =>
  JSON.parse(window.localStorage.getItem(OVERPASS_HISTORY_KEY) ?? '[]').filter(
    Boolean,
  );

export const addOverpassQueryHistory = (query: string) => {
  const oldHistory = getOverpassQueryHistory().filter((q) => q !== query);
  window.localStorage.setItem(
    OVERPASS_HISTORY_KEY,
    JSON.stringify([query, ...oldHistory]),
  );
};

export const getOverpassOptions = (inputValue: string): OverpassOption[] => {
  if (inputValue.match(/^(op|overpass):/)) {
    return [
      {
        type: 'overpass',
        overpass: {
          query: inputValue.replace(/^(op|overpass):/, ''),
          label: t('searchbox.overpass_custom_query'),
          inputValue,
        },
      },
      ...getOverpassQueryHistory().map((query) => ({
        type: 'overpass' as const,
        overpass: {
          query,
          label: query,
          inputValue: `op:${query}`,
        },
      })),
    ];
  }

  try {
    const ast = getAST(inputValue);
    return [
      {
        type: 'overpass',
        overpass: {
          ast,
          inputValue,
          label: queryWizardLabel(ast),
        },
      },
    ];
  } catch {}

  return [];
};

type Props = {
  option: OverpassOption;
};

export const OverpassRow = ({ option: { overpass } }: Props) => (
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
