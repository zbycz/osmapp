import StarIcon from '@mui/icons-material/Star';
import sortBy from 'lodash/sortBy';
import { Grid, Typography } from '@mui/material';
import React from 'react';
import { getHumanDistance, IconPart } from '../utils';
import type { Star } from '../../utils/StarsContext';
import { StarOption } from '../types';
import match from 'autosuggest-highlight/match';
import { LonLat } from '../../../services/types';

export const getStarsOptions = (
  stars: Star[],
  inputValue: string,
): StarOption[] => {
  const ratedStars = sortBy(
    stars
      .map((star) => ({
        star,
        // TODO matching is not optimal, maybe Sørensen–Dice coefficient
        // https://www.npmjs.com/package/dice-coefficient
        matching:
          inputValue === ''
            ? Infinity
            : match(star.label, inputValue, {
                insideWords: true,
                findAllOccurrences: true,
              }).length,
      }))
      .filter(({ matching }) => matching > 0),
    ({ matching }) => matching,
  );
  return ratedStars.map(({ star }) => ({ type: 'star', star }));
};

export const renderStar = ({ star }: StarOption, mapCenter: LonLat) => {
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
        <span style={{ fontWeight: 700 }}>{star.label}</span>
        <Typography variant="body2" color="textSecondary">
          {star.poiType}
        </Typography>
      </Grid>
    </>
  );
};
