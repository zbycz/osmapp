import StarIcon from '@mui/icons-material/Star';
import { Grid, Typography } from '@mui/material';
import React from 'react';
import { IconPart } from '../utils';
import type { Star } from '../../utils/StarsContext';

// TODO filter stars by inputValue
export const getStarsOptions = (stars: Star[]) =>
  stars.map((star) => ({ star }));

export const renderStar = (star) => (
  <>
    <IconPart>
      <StarIcon />
    </IconPart>
    <Grid item xs={8}>
      <span style={{ fontWeight: 700 }}>{star.label}</span>
      <Typography variant="body2" color="textSecondary">
        {star.poiType}
      </Typography>
    </Grid>
  </>
);
