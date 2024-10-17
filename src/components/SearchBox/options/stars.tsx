import StarIcon from '@mui/icons-material/Star';
import { Grid, Typography } from '@mui/material';
import React from 'react';
import {
  diceCoefficientSort,
  getHumanDistance,
  highlightText,
  IconPart,
} from '../utils';
import type { Star } from '../../utils/StarsContext';
import { StarOption } from '../types';
import { LonLat } from '../../../services/types';

export const getStarsOptions = (
  stars: Star[],
  inputValue: string,
): StarOption[] => {
  if (inputValue === '') {
    return stars.map((star) => ({ type: 'star', star }));
  }
  const sorted = diceCoefficientSort(
    stars,
    ({ label }) => label,
    inputValue,
    0.25,
  );
  return sorted.map((star) => ({ type: 'star', star }));
};

export const renderStar = (
  { star }: StarOption,
  inputValue: string,
  mapCenter: LonLat,
) => {
  // Note: for compatibility, `center` is optional
  const distance = star.center
    ? getHumanDistance(mapCenter, star.center)
    : null;

  return (
    <>
      <IconPart>
        <StarIcon />
        {distance !== null && <div>{distance}</div>}
      </IconPart>
      <Grid item xs={8}>
        {highlightText(star.label, inputValue)}
        <Typography variant="body2" color="textSecondary">
          {star.poiType}
        </Typography>
      </Grid>
    </>
  );
};
