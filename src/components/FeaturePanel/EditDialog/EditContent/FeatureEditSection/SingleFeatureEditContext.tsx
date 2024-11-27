import React, { createContext, useContext, useState } from 'react';
import { OsmId } from '../../../../../services/types';
import { FeatureEditData, useEditContext } from '../../EditContext';

type SingleFeatureEditContextType = {
  featureId: OsmId;
};

// TODO rename if it contains only the featureId
const SingleFeatureEditContext =
  createContext<SingleFeatureEditContextType>(undefined);

export const SingleFeatureEditContextProvider = ({ children, featureId }) => {
  const value: SingleFeatureEditContextType = {
    featureId,
  };

  return (
    <SingleFeatureEditContext.Provider value={value}>
      {children}
    </SingleFeatureEditContext.Provider>
  );
};

export const useFeatureEditData = (): FeatureEditData => {
  const { data } = useEditContext();
  const { featureId } = useContext(SingleFeatureEditContext);

  return data.find(
    (item) =>
      item.featureId.type === featureId.type &&
      item.featureId.id === featureId.id,
  );
};
