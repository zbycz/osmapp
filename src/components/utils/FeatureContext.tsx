import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Feature } from '../../services/types';

export interface FeatureContextType {
  feature: Feature | null;
  featureShown: boolean;
  setFeature: (feature: Feature | null) => void;
}

export const FeatureContext = createContext<FeatureContextType>(undefined);

interface Props {
  featureFromRouter: Feature | null;
  children: ReactNode;
}

export const FeatureProvider = ({ children, featureFromRouter }: Props) => {
  const [feature, setFeature] = useState(featureFromRouter);
  const featureShown = feature != null;

  useEffect(() => {
    // set feature fetched by next.js router
    setFeature(featureFromRouter);
  }, [featureFromRouter]);

  // setFeature - used only for skeletons (otherwise it gets loaded by router)
  const value = { feature, featureShown, setFeature };

  return (
    <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>
  );
};

export const useFeatureContext = () => useContext(FeatureContext);
