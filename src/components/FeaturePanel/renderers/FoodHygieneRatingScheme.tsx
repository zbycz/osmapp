import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
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
    console.log('rating', error);
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
          {Number.isNaN(rating) || error ? (
            <>
              <Typography color="error">No rating available</Typography>
            </>
          ) : (
            <>
              <p>Rating: {rating}</p>
            </>
          )}
        </>
      )}
    </>
  );
};
