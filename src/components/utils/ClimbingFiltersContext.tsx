import React, { createContext, useContext, useState } from 'react';
import { Setter } from '../../types';
import { ClimbingFilterType } from '../Map/climbingTiles/climbingFiltersUtils';

type ClimbingFiltersContextType = {
  type: ClimbingFilterType;
  setType: Setter<ClimbingFilterType>;
};

export const ClimbingFiltersContext =
  createContext<ClimbingFiltersContextType>(undefined);

export const ClimbingFiltersProvider = ({ children }) => {
  const [type, setType] = useState<ClimbingFilterType>([
    'gym',
    'viaFerrata',
    'rockClimbing',
  ]);

  const climbingFilters: ClimbingFiltersContextType = {
    type,
    setType,
  };

  return (
    <ClimbingFiltersContext.Provider value={climbingFilters}>
      {children}
    </ClimbingFiltersContext.Provider>
  );
};

export const useClimbingFiltersContext = () =>
  useContext(ClimbingFiltersContext);
