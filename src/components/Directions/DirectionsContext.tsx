import React, { createContext, useContext, useState } from 'react';
import { Profile, RoutingResult } from './routing/types';
import { Option } from '../SearchBox/types';

type DirectionsContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  mode: Profile;
  setMode: (mode: Profile) => void;
  result: RoutingResult;
  setResult: (result: RoutingResult) => void;
  points: Array<Option>;
  setPoints: (points: Array<Option>) => void;
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
