import React, { createContext, useContext } from 'react';
import { usePersistedState } from './usePersistedState';
import { useFeatureContext } from './FeatureContext';
import { getShortId } from '../../services/helpers';
import { getLabel, getPoiType } from '../../helpers/featureLabel';

type Star = { shortId: string; poiType: string; label: string };

interface StarsType {
  stars: Star[];
  isStarred: boolean;
  toggleStar: () => void;
}

export const StarsContext = createContext<StarsType>(undefined);

const hasStar = (stars: Star[], shortId: string) =>
  !!stars.find((star) => star.shortId === shortId);

export const StarsProvider = ({ children }) => {
  const { feature } = useFeatureContext();

  const [stars, setStars] = usePersistedState<Star[]>('stars', []);
  const shortId = feature ? getShortId(feature.osmMeta) : undefined;
  const isStarred = hasStar(stars, shortId);
  const toggleStar = () => {
    if (!shortId) {
      return;
    }

    setStars((data) => hasStar(data, shortId)
        ? data.filter((star) => star.shortId !== shortId)
        : data.concat({
            shortId,
            poiType: getPoiType(feature),
            label: getLabel(feature),
          }));
  };

  const value = { stars, isStarred, toggleStar };

  return (
    <StarsContext.Provider value={value}>{children}</StarsContext.Provider>
  );
};

export const useStarsContext = () => useContext(StarsContext);
