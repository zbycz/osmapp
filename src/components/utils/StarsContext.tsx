import React, { createContext, useContext } from 'react';
import { usePersistedState } from './usePersistedState';
import { useFeatureContext } from './FeatureContext';
import { getShortId } from '../../services/helpers';
import { getLabel, getHumanPoiType } from '../../helpers/featureLabel';
import { LonLat } from '../../services/types';
import { useMapStateContext, View } from './MapStateContext';

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

const getLonLat = ([z, lat, lon]: View): LonLat => {
  return [parseFloat(lon), parseFloat(lat)];
};

export const StarsProvider: React.FC = ({ children }) => {
  const { view } = useMapStateContext();
  const { feature } = useFeatureContext();
  const shortId = feature ? getShortId(feature.osmMeta) : undefined;

  const [stars, setStars] = usePersistedState<Star[]>('stars', []);
  const isStarred = hasStar(stars, shortId);

  // between 2024-02 and 2024-06 stars were saved without center, lets remove them now, as Directions will not work without center
  const starsWithCenter = stars.filter((star) => star.center);
  if (stars.length !== starsWithCenter.length) {
    setStars(starsWithCenter);
  }

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
            center: feature.center ?? getLonLat(view), // feature can be without center, when Overpass fails
          }),
    );
  };

  const value: StarsContextType = { stars, isStarred, toggleStar };

  return (
    <StarsContext.Provider value={value}>{children}</StarsContext.Provider>
  );
};

export const useStarsContext = () => useContext(StarsContext);
