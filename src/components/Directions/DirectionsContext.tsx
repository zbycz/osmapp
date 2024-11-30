import React, { createContext, useContext, useState } from 'react';
import { Profile, RoutingResult } from './routing/types';
import { Option } from '../SearchBox/types';

type CragViewLayout = 'vertical' | 'horizontal' | 'auto';

type DirectionsContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  mode: Profile;
  setMode: (mode: Profile) => void;
  from: Option;
  setFrom: (from: Option) => void;
  to: Option;
  setTo: (to: Option) => void;
  result: RoutingResult;
  setResult: (result: RoutingResult) => void;
};

export const DirectionsContext =
  createContext<DirectionsContextType>(undefined);

export const DirectionsProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Profile>('car');
  const [from, setFrom] = useState<Option>();
  const [to, setTo] = useState<Option>();
  const [result, setResult] = useState<RoutingResult>(null);

  const value: DirectionsContextType = {
    loading,
    setLoading,
    mode,
    setMode,
    from,
    setFrom,
    to,
    setTo,
    result,
    setResult,
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
