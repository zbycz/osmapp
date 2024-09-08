import React, { useEffect } from 'react';
import { useFeatureContext } from '../utils/FeatureContext';
import { PROJECT_ID } from '../../services/project';
import { useMobileMode } from '../helpers';
import { Homepage } from './Homepage';
import { MobilePageDrawer } from '../utils/MobilePageDrawer';

export const HomepagePanel = () => {
  const { feature, homepageShown, hideHomepage, persistHideHomepage } =
    useFeatureContext();
  const isMobileMode = useMobileMode();

  // hide after first shown feature
  useEffect(() => {
    if (feature) hideHomepage();
  }, [feature, hideHomepage]);

  if (!homepageShown) {
    return null;
  }

  const isClimbing = PROJECT_ID === 'openclimbing';

  const onClose = (_, open) => {
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
