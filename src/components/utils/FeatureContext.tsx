import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import Router from 'next/router';
import { Feature } from '../../services/types';
import { useBoolState } from '../helpers';

export interface FeatureContextType {
  feature: Feature | null;
  featureShown: boolean;
  setFeature: (feature: Feature | null) => void; // setFeature - used only for skeletons (otherwise it gets loaded by router)
  homepageShown: boolean;
  hideHomepage: () => void;
  showHomepage: () => void;
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

  const [homepageShown, showHomepageOrig, hideHomepage] = useBoolState(
    feature == null,
  );
  const showHomepage = () => {
    Router.push('/');
    setFeature(null);
    showHomepageOrig();
  };

  const value = {
    feature,
    featureShown,
    setFeature,
    homepageShown,
    showHomepage,
    hideHomepage,
  };

  return (
    <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>
  );
};

export const useFeatureContext = () => useContext(FeatureContext);
