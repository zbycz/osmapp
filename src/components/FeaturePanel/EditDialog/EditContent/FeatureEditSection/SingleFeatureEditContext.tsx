import React, { createContext, useContext, useState } from 'react';
import { OsmId } from '../../../../../services/types';
import { useEditContext } from '../../EditContext';
import { getShortId } from '../../../../../services/helpers';
import { EditDataItem } from '../../useEditItems';

type SingleFeatureEditContextType = {
  shortId: string;
};

// TODO rename if it contains only the shortId
const SingleFeatureEditContext =
  createContext<SingleFeatureEditContextType>(undefined);

export const SingleFeatureEditContextProvider = ({ children, shortId }) => {
  const value: SingleFeatureEditContextType = {
    shortId,
  };

  return (
    <SingleFeatureEditContext.Provider value={value}>
      {children}
    </SingleFeatureEditContext.Provider>
  );
};

export const useFeatureEditData = (): EditDataItem => {
  const { items } = useEditContext();
  const { shortId } = useContext(SingleFeatureEditContext);

  return items.find((item) => item.shortId === shortId);
};
