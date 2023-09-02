import React, { useEffect, useState } from 'react';
import { Tooltip, Typography } from '@material-ui/core';
import { Restaurant } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
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

  return (
    <>
      {loading ? (
        <>
          <span className="dotloader" />
          <span className="dotloader" />
          <span className="dotloader" />
        </>
      ) : (
        <>
          <Restaurant fontSize="small" />
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
                FHRS
              </a>
            </Tooltip>

            {Number.isNaN(rating) || error ? (
              <Typography color="textSecondary">
                (Error while fetching rating)
              </Typography>
            ) : (
              <Rating value={rating} readOnly />
            )}
          </Wrapper>
        </>
      )}
    </>
  );
};
