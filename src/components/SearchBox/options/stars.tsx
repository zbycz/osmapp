import StarIcon from '@mui/icons-material/Star';
import { Grid, Typography } from '@mui/material';
import React from 'react';
import {
  diceCoefficientSort,
  getHumanDistance,
  highlightText,
  IconPart,
  useMapCenter,
} from '../utils';
import type { Star } from '../../utils/StarsContext';
import { GeocoderOption, StarOption } from '../types';
import { LonLat } from '../../../services/types';
import {
  UserSettingsContext,
  useUserSettingsContext,
} from '../../utils/UserSettingsContext';

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

type Props = {
  option: StarOption;
  inputValue: string;
};

export const StarRow = ({ option: { star }, inputValue }: Props) => {
  const mapCenter = useMapCenter();
  const { isImperial } = useUserSettingsContext().userSettings;

  // Note: for compatibility, `center` is optional
  const distance = star.center
    ? getHumanDistance(isImperial, mapCenter, star.center)
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
