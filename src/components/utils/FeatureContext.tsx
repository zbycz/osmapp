import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import Router, { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Feature } from '../../services/types';
import { useBoolState } from '../helpers';
import { publishDbgObject } from '../../utils';
import { setLastFeature } from '../../services/lastFeatureStorage';

export type FeatureContextType = {
  feature: Feature | null;
  featureShown: boolean;
  /** Used only for skeletons (otherwise it gets loaded by router) */
  setFeature: (feature: Feature | null) => void;
  homepageShown: boolean;
  showHomepage: () => void;
  hideHomepage: () => void;
  persistHideHomepage: () => void;
  persistShowHomepage: () => void;
  preview: Feature | null;
  setPreview: (feature: Feature | null) => void;
};

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

  const router = useRouter();
  const isIndex = router.pathname === '/';
  const [homepageShown, showHomepage, hideHomepage] = useBoolState(
    feature === null && isIndex && cookies.hideHomepage !== 'yes',
  );
  const persistShowHomepage = () => {
    setFeature(null);
    hideHomepage();
    Cookies.remove('hideHomepage');
    Router.push(`/${window.location.hash}`).then(() => {
      showHomepage();
    });
  };
  const persistHideHomepage = () => {
    hideHomepage();
    Cookies.set('hideHomepage', 'yes', { expires: 30, path: '/' });
  };

  if (feature) {
    setLastFeature(feature); // cleared only in onClosePanel
  }

  const value: FeatureContextType = {
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

export type SetFeature = React.Dispatch<React.SetStateAction<Feature>>;
