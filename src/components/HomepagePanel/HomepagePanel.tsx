import React, { useEffect } from 'react';
import { useFeatureContext } from '../utils/FeatureContext';
import { PROJECT_ID } from '../../services/project';
import { useMobileMode } from '../helpers';
import { Drawer } from '../utils/Drawer';
import { Homepage } from './Homepage';
import { PanelWrapper } from '../utils/PanelHelpers';

export const HomepagePanel = () => {
  const { feature, homepageShown, hideHomepage, persistHideHomepage } =
    useFeatureContext();
  const isMobileMode = useMobileMode();

  // hide after first shown feature
  useEffect(() => {
    if (feature) hideHomepage();
  }, [feature]);

  if (!homepageShown) {
    return null;
  }

  const isClimbing = PROJECT_ID === 'openclimbing';

  const onClose = (_, open) => {
    if (!open) {
      persistHideHomepage();
    }
  };

  return isMobileMode ? (
    <Drawer
      topOffset={180}
      className="homepage-drawer"
      collapsedHeight={0}
      onTransitionEnd={onClose}
      defaultOpen
    >
      <Homepage
        onClick={persistHideHomepage}
        climbing={isClimbing}
        mobileMode={isMobileMode}
      />
    </Drawer>
  ) : (
    <PanelWrapper>
      <Homepage
        onClick={persistHideHomepage}
        climbing={isClimbing}
        mobileMode={isMobileMode}
      />
    </PanelWrapper>
  );
};
