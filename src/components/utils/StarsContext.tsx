import React, { createContext, useContext } from 'react';
import { usePersistedState } from './usePersistedState';
import { useFeatureContext } from './FeatureContext';
import { getShortId } from '../../services/helpers';
import { getLabel } from '../../helpers/featureLabel';

interface StarsType {
  stars: Record<string, string>;
  isStarred: boolean;
  toggleStar: () => void;
}

export const StarsContext = createContext<StarsType>(undefined);

export const StarsProvider = ({ children }) => {
  const { feature } = useFeatureContext();

  const [stars, setStars] = usePersistedState('stars', {});

  const shortId = feature ? getShortId(feature.osmMeta) : undefined;
  const isStarred = !!stars[shortId];

  const toggleStar = () => {
    if (!shortId) {
      return;
    }

    setStars((stars2) => {
      if (stars2[shortId]) {
        const starsClone = { ...stars2 };
        delete starsClone[shortId];
        return { ...starsClone };
      }

      return {
        ...stars2,
        [shortId]: getLabel(feature),
      };
    });
  };

  const value = { stars, isStarred, toggleStar };

  return (
    <StarsContext.Provider value={value}>{children}</StarsContext.Provider>
  );
};

export const useStarsContext = () => useContext(StarsContext);
