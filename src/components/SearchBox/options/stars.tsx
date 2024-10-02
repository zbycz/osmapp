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
  const ratedStars = inputValue
    ? diceCoefficientSort(stars, ({ label }) => label, inputValue)
    : stars;
  return ratedStars.map((star) => ({ type: 'star', star }));
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
        <span style={{ fontWeight: 700 }}>
          {highlightText(star.label, inputValue)}
        </span>
        <Typography variant="body2" color="textSecondary">
          {star.poiType}
        </Typography>
      </Grid>
    </>
  );
};
