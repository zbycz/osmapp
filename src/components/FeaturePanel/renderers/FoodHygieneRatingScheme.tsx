import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import { Restaurant } from '@material-ui/icons';
import { getEstablishmentRatingValue } from '../../../services/fhrsApi';

interface StarRatingProps {
  stars: number;
  maxStars: number;
}

const StarRating = ({ stars, maxStars }: StarRatingProps) => {
  const starArray = new Array(maxStars).fill(0);
  return (
    <div>
      {starArray.map((_, i) => (
        <span>{i < stars ? '★' : '☆'}</span>
      ))}
    </div>
  );
};

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
          {Number.isNaN(rating) || error ? (
            <Typography color="error">No rating available</Typography>
          ) : (
            <>
              <StarRating stars={rating} maxStars={5} />
            </>
          )}
        </>
      )}
    </>
  );
};
