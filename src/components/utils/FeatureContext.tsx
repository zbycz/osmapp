import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import Router from 'next/router';
import Cookies from 'js-cookie';
import { Feature } from '../../services/types';
import { useBoolState } from '../helpers';
import { publishDbgObject } from '../../utils';

export interface FeatureContextType {
  feature: Feature | null;
  featureShown: boolean;
  setFeature: (feature: Feature | null) => void; // setFeature - used only for skeletons (otherwise it gets loaded by router)
  homepageShown: boolean;
  showHomepage: () => void;
  hideHomepage: () => void;
  persistHideHomepage: () => void;
  persistShowHomepage: () => void;
  preview: Feature | null;
  setPreview: (feature: Feature | null) => void;
}

export const FeatureContext = createContext<FeatureContextType>(undefined);

interface Props {
  featureFromRouter: Feature | null;
  children: ReactNode;
  cookies: Record<string, string>;
}

export const FeatureProvider = ({
  children,
  featureFromRouter,
  cookies,
}: Props) => {
  const [preview, setPreview] = useState<Feature>(null);
  const [feature, setFeature] = useState<Feature>(featureFromRouter);
  const featureShown = feature != null;

  useEffect(() => {
    // set feature on next.js router transition
    setFeature(featureFromRouter);
    publishDbgObject('feature', featureFromRouter);
    publishDbgObject('schema', featureFromRouter?.schema);
  }, [featureFromRouter]);

  const [homepageShown, showHomepage, hideHomepage] = useBoolState(
    feature == null && cookies.hideHomepage !== 'yes',
  );
  const persistShowHomepage = () => {
    setFeature(null);
    hideHomepage();
    showHomepage();
    Router.push(`/${window.location.hash}`);
    Cookies.remove('hideHomepage');
  };
  const persistHideHomepage = () => {
    hideHomepage();
    Cookies.set('hideHomepage', 'yes', { expires: 30, path: '/' });
  };

  const value = {
    feature,
    featureShown,
    setFeature,
    homepageShown,
    showHomepage,
    hideHomepage,
    persistShowHomepage,
    persistHideHomepage,
    preview,
    setPreview,
  };
  return (
    <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>
  );
};

export const useFeatureContext = () => useContext(FeatureContext);
