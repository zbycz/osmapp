import React, { createContext, useContext, useState } from 'react';
import { OsmId } from '../../../../../services/types';
import { useEditContext } from '../../EditContext';
import { getShortId } from '../../../../../services/helpers';
import { EditDataItem } from '../../useEditItems';

type CurrentContextType = {
  shortId: string;
};

const CurrentContext = createContext<CurrentContextType>(undefined);

export const CurrentContextProvider = ({ children, shortId }) => {
  const value: CurrentContextType = {
    shortId,
  };

  return (
    <CurrentContext.Provider value={value}>{children}</CurrentContext.Provider>
  );
};

export const useCurrentItem = (): EditDataItem => {
  const { items } = useEditContext();
  const { shortId } = useContext(CurrentContext);

  return items.find((item) => item.shortId === shortId);
};
