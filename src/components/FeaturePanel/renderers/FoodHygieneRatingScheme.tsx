import React, { useEffect, useState } from 'react';
import { Tooltip, Typography } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import styled from 'styled-components';
import { getEstablishmentRatingValue } from '../../../services/fhrsApi';

const useLoadingState = () => {
  const [rating, setRating] = useState<number>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  const finishRating = (payload) => {
    setLoading(false);
    setRating(payload);
  };

  const startRating = () => {
    setLoading(true);
    setRating(undefined);
    setError(undefined);
  };

  const failRating = () => {
    setError('Could not load rating');
    setLoading(false);
  };

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
    useLoadingState();

  useEffect(() => {
    const loadData = async () => {
      startRating();
      const ratingValue = await getEstablishmentRatingValue(v);
      if (Number.isNaN(rating)) {
        failRating();
      }
      finishRating(ratingValue);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <>
        <span className="dotloader" />
        <span className="dotloader" />
        <span className="dotloader" />
      </>
    );
  }

  return (
    <>
      <RestaurantIcon fontSize="small" />
      <Wrapper>
        <Tooltip
          arrow
          interactive
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
