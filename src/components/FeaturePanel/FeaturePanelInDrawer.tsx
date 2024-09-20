import React from 'react';
import { FeaturePanel } from './FeaturePanel';
import { Drawer } from '../utils/Drawer';
import {
  DRAWER_PREVIEW_HEIGHT,
  DRAWER_PREVIEW_PADDING,
  DRAWER_TOP_OFFSET,
} from '../utils/MobilePageDrawer';
import { useScreensize } from '../../helpers/hooks';
import { useFeatureContext } from '../utils/FeatureContext';

const DRAWER_CLASSNAME = 'featurePanelInDrawer';

export const FeaturePanelInDrawer = () => {
  const { feature } = useFeatureContext();
  const [collapsedHeight, setCollapsedHeight] = React.useState<number>(
    DRAWER_PREVIEW_HEIGHT,
  );
  const { height: windowHeight } = useScreensize();
  const maxCollapsedHeight = windowHeight / 3;

  const headingRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    const headingDiv = headingRef.current;
    if (!headingDiv) return;

    const baseHeight = Math.min(headingDiv.clientHeight, maxCollapsedHeight);
    setCollapsedHeight(baseHeight + DRAWER_PREVIEW_PADDING);
  }, [headingRef, feature]);

  return (
    <Drawer
      key={`drawer-${collapsedHeight}px`}
      topOffset={DRAWER_TOP_OFFSET}
      className={DRAWER_CLASSNAME}
      collapsedHeight={collapsedHeight}
    >
      <FeaturePanel ref={headingRef} />
    </Drawer>
  );
};
