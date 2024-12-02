import React, { createContext, useContext, useState } from 'react';
import { OsmId } from '../../../../../services/types';
import { useEditContext } from '../../EditContext';
import { getShortId } from '../../../../../services/helpers';
import { EditDataItem } from '../../useEditItems';

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

export const useFeatureEditData = (): EditDataItem => {
  const { items } = useEditContext();
  const { featureId } = useContext(SingleFeatureEditContext);

  return items.find((item) => item.shortId === getShortId(featureId));
};
