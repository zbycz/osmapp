import React, { createContext, useContext } from 'react';
import { usePersistedState } from './usePersistedState';
import { useFeatureContext } from './FeatureContext';
import { getShortId } from '../../services/helpers';
import { getLabel, getHumanPoiType } from '../../helpers/featureLabel';
import { LonLat } from '../../services/types';

export type Star = {
  shortId: string;
  poiType: string;
  label: string;
  center: LonLat;
};

type StarsContextType = {
  stars: Star[];
  isStarred: boolean;
  toggleStar: () => void;
};

export const StarsContext = createContext<StarsContextType>(undefined);

const hasStar = (stars: Star[], shortId: string) =>
  !!stars.find((star) => star.shortId === shortId);

export const StarsProvider = ({ children }) => {
  const { feature } = useFeatureContext();
  const shortId = feature ? getShortId(feature.osmMeta) : undefined;

  const [stars, setStars] = usePersistedState<Star[]>('stars', []);
  const isStarred = hasStar(stars, shortId);

  const toggleStar = () => {
    if (!shortId) {
      return;
    }

    setStars((data) =>
      hasStar(data, shortId)
        ? data.filter((star) => star.shortId !== shortId)
        : data.concat({
            shortId,
            poiType: getHumanPoiType(feature),
            label: getLabel(feature),
            center: feature.center,
          }),
    );
  };

  const value: StarsContextType = { stars, isStarred, toggleStar };

  return (
    <StarsContext.Provider value={value}>{children}</StarsContext.Provider>
  );
};

export const useStarsContext = () => useContext(StarsContext);
