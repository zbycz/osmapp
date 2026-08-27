import { useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { useFeatureContext } from '../utils/FeatureContext';

const DIRECTIONS_DEEPLINK_REGEX =
  /^\/(?:[a-z]{2}\/)?(?:node|way|relation)\/\d+\/directions\/?$/i;

const isDirectionsDeeplink = () =>
  Router.query.all?.[2] === 'directions' ||
  DIRECTIONS_DEEPLINK_REGEX.test(window.location.pathname); // hacky static export

export const DirectionsDeeplink = () => {
  const router = useRouter();
  const { feature } = useFeatureContext();
  const featureLoaded = !!feature && !feature.skeleton;

  useEffect(() => {
    if (featureLoaded && isDirectionsDeeplink()) {
      Router.replace('/directions'); // the loaded feature is prefilled as destination, see useReactToUrl()
    }
  }, [featureLoaded, router.asPath]);

  return null;
};
