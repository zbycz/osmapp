import React, { useEffect } from 'react';
import { useFeatureContext } from '../utils/FeatureContext';
import { useMobileMode } from '../helpers';
import { Homepage } from './Homepage';
import { MobilePageDrawer } from '../utils/MobilePageDrawer';
import { useRouter } from 'next/router';

/** shows conditionally on first visit, or in /install
 */
export const HomepagePanel = () => {
  const { feature, homepageShown, hideHomepage, persistHideHomepage } =
    useFeatureContext();
  const isMobileMode = useMobileMode();

  const router = useRouter();
  const notIndex = router.pathname !== '/';

  // hide after first shown feature or directions box
  useEffect(() => {
    if (feature || notIndex) hideHomepage();
  }, [feature, notIndex, hideHomepage]);

  if (!homepageShown) {
    return null;
  }

  const onClose = (_: React.TransitionEvent<HTMLDivElement>, open: boolean) => {
    if (!open) {
      persistHideHomepage();
    }
  };

  return (
    <MobilePageDrawer
      onClose={onClose}
      className="homepage-drawer"
      collapsedHeight={0}
      topOffset={180}
    >
      <Homepage onClick={persistHideHomepage} mobileMode={isMobileMode} />
    </MobilePageDrawer>
  );
};
