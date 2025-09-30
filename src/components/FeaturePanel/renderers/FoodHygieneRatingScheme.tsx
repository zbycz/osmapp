import React, { useCallback, useEffect, useState } from 'react';
import { Tooltip, Typography } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import styled from '@emotion/styled';
import { getEstablishmentRatingValue } from '../../../services/fhrsApi';
import { DotLoader } from '../../helpers';

// TODO replace with react-query
//  Please do not copy `useLoadingStateDeprecated()` elsewhere, use react-query instead.
//  Refer to `FeaturePanel/Runways/Runways.tsx` for usage.
//  More in https://tkdodo.eu/blog/why-you-want-react-query
const useLoadingStateDeprecated = () => {
  const [rating, setRating] = useState<number>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  const finishRating = useCallback((payload) => {
    setLoading(false);
    setRating(payload);
  }, []);

  const startRating = useCallback(() => {
    setLoading(true);
    setRating(undefined);
    setError(undefined);
  }, []);

  const failRating = useCallback(() => {
    setError('Could not load rating');
    setLoading(false);
  }, []);

  return { rating, error, loading, startRating, finishRating, failRating };
};

const Wrapper = styled.div`
  display: flex;
  gap: 0.5rem;

  .MuiRating-root {
    margin-top: -2px;
  }
`;

const RatingRound = styled.span`
  border-radius: 50%;
  background-color: #1a6500;
  color: #fff;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: bold;
  position: relative;
  top: -1px;
`;

export const FoodHygieneRatingSchemeRenderer = ({ v }) => {
  const { rating, error, loading, startRating, finishRating, failRating } =
    useLoadingStateDeprecated();

  useEffect(() => {
    (async () => {
      startRating();
      const ratingValue = await getEstablishmentRatingValue(v);
      if (Number.isNaN(rating)) {
        failRating();
      }
      finishRating(ratingValue);
    })();
  }, [failRating, finishRating, rating, startRating, v]);

  if (loading) {
    return <DotLoader />;
  }

  return (
    <>
      <RestaurantIcon fontSize="small" />
      <Wrapper>
        <Tooltip
          arrow
          title="Food Hygiene Rating Scheme (only in UK)"
          placement="bottom-end"
        >
          <a
            href={`https://ratings.food.gov.uk/business/${v}`}
            className="colorInherit"
          >
            FHRS{' '}
            {Number.isNaN(rating) || error ? (
              <Typography color="textSecondary">
                (Error while fetching rating)
              </Typography>
            ) : (
              <RatingRound>{rating}</RatingRound>
            )}
          </a>
        </Tooltip>
      </Wrapper>
    </>
  );
};
