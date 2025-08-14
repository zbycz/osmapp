import { useMobileMode } from '../helpers';
import { useFeatureContext } from '../utils/FeatureContext';
import { FeaturePanelInDrawer } from './FeaturePanelInDrawer';
import { FeaturePanelOnSide } from './FeaturePanelOnSide';
import React, { useEffect, useRef } from 'react';
import { useMapStateContext } from '../utils/MapStateContext';
import { Scrollbars } from 'react-custom-scrollbars';
import { useRouter } from 'next/router';
import { getMapViewFromHash } from '../App/helpers';

const useUpdateViewFromFeature = () => {
  const { feature } = useFeatureContext();
  const { setView } = useMapStateContext();

  useEffect(() => {
    if (!feature?.center) return;
    if (getMapViewFromHash()) return;

    const [lon, lat] = feature.center.map((deg) => deg.toFixed(4));
    setView(['17.00', lat, lon]);
  }, [feature, setView]);
};

const useScrollToTopWhenRouteChanged = () => {
  const isMobileMode = useMobileMode();
  const desktopScrollRef = useRef<Scrollbars>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const scrollRef = isMobileMode ? mobileScrollRef : desktopScrollRef;
  const router = useRouter();

  useEffect(() => {
    const routeChangeComplete = () => {
      if (scrollRef?.current) {
        if (isMobileMode) {
          (scrollRef as any).current?.scrollTo?.(0, 0);
        } else {
          (scrollRef as any).current?.scrollToTop?.();
        }
      }
    };
    router.events.on('routeChangeComplete', routeChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', routeChangeComplete);
    };
  }, [isMobileMode, router.events, scrollRef]);

  return scrollRef;
};

// TODO this is temporary refactoring, ultimate goal is extract PanelWrapper outside and use it for all panels including here

export const ResponsiveFeaturePanel = () => {
  const isMobileMode = useMobileMode();
  const { featureShown } = useFeatureContext();
  const scrollRef = useScrollToTopWhenRouteChanged() as any;
  useUpdateViewFromFeature();

  if (!featureShown) {
    return null;
  }

  return isMobileMode ? (
    <FeaturePanelInDrawer scrollRef={scrollRef} />
  ) : (
    <FeaturePanelOnSide scrollRef={scrollRef} />
  );
};
