import React, { createContext, useContext } from 'react';
import { HistoryOption } from '../types';
import { usePersistedState } from '../../utils/usePersistedState';
import uniqBy from 'lodash/uniqBy';

type HistoryContextType = {
  options: HistoryOption[];
  addOption: (option: HistoryOption) => void;
  clearOptions: () => void;
};

export const HistoryContext = createContext<HistoryContextType>(undefined);

export const HistoryProvider: React.FC = ({ children }) => {
  const [options, setOptions] = usePersistedState<HistoryOption[]>(
    'searchbox-history',
    [],
  );
  const value: HistoryContextType = {
    options,
    addOption: (opt) => {
      setOptions((prev) =>
        uniqBy(
          [opt, ...prev],
          ({ history: { osmMeta } }) => `${osmMeta.type}/${osmMeta.id}`,
        ),
      );
    },
    clearOptions: () => setOptions([]),
  };

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
};

export const useHistoryContext = () => useContext(HistoryContext);
