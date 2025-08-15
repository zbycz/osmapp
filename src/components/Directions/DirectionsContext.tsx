import React, { createContext, useContext, useState } from 'react';
import { Profile, RoutingResult } from './routing/types';
import { Option } from '../SearchBox/types';
import { Setter } from '../../types';

type DirectionsContextType = {
  loading: boolean;
  setLoading: Setter<boolean>;
  mode: Profile;
  setMode: Setter<Profile>;
  result: RoutingResult;
  setResult: Setter<RoutingResult>;
  points: Option[];
  setPoints: Setter<Option[]>;
};

export const DirectionsContext =
  createContext<DirectionsContextType>(undefined);

export const DirectionsProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Profile>('car');
  const [result, setResult] = useState<RoutingResult>(null);
  const [points, setPoints] = useState<Array<Option>>([]);

  const value: DirectionsContextType = {
    loading,
    setLoading,
    mode,
    setMode,
    result,
    setResult,
    points,
    setPoints,
  };
  return (
    <DirectionsContext.Provider value={value}>
      {children}
    </DirectionsContext.Provider>
  );
};

export const useDirectionsContext = () => {
  const context = useContext(DirectionsContext);
  if (!context) {
    throw new Error(
      'useDirectionsContext must be used within a DirectionsProvider',
    );
  }
  return context;
};
