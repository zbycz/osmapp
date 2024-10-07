import React, { useEffect } from 'react';
import { useFeatureContext } from '../utils/FeatureContext';
import { PROJECT_ID } from '../../services/project';
import { useMobileMode } from '../helpers';
import { Homepage } from './Homepage';
import { MobilePageDrawer } from '../utils/MobilePageDrawer';
import { useRouter } from 'next/router';

export const HomepagePanel = () => {
  const { feature, homepageShown, hideHomepage, persistHideHomepage } =
    useFeatureContext();
  const isMobileMode = useMobileMode();

  const router = useRouter();
  const directions = router.query.all?.[0] === 'directions';

  // hide after first shown feature or directions box
  useEffect(() => {
    if (feature || directions) hideHomepage();
  }, [feature, directions, hideHomepage]);

  if (!homepageShown) {
    return null;
  }

  const isClimbing = PROJECT_ID === 'openclimbing';

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
