import React, { Ref } from 'react';
import { FeaturePanel } from './FeaturePanel';
import { Drawer } from '../utils/Drawer';
import {
  DRAWER_PREVIEW_HEIGHT,
  DRAWER_TOP_OFFSET,
} from '../utils/MobilePageDrawer';
import { useScreensize } from '../../helpers/hooks';
import { useFeatureContext } from '../utils/FeatureContext';

const DRAWER_CLASSNAME = 'featurePanelInDrawer';

type FeaturePanelInDrawerProps = {
  scrollRef: Ref<HTMLDivElement>;
};

export const FeaturePanelInDrawer = ({
  scrollRef,
}: FeaturePanelInDrawerProps) => {
  const { feature } = useFeatureContext();

  const [collapsedHeight, setCollapsedHeight] = React.useState<number>(
    DRAWER_PREVIEW_HEIGHT,
  );
  const [collapsed, setCollapsed] = React.useState(true);

  const { height: windowHeight } = useScreensize();
  const maxCollapsedHeight = windowHeight / 3;

  const headingRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    const headingDiv = headingRef.current;
    if (!headingDiv) return;

    const baseHeight = Math.min(headingDiv.clientHeight, maxCollapsedHeight);
    setCollapsedHeight(baseHeight);
  }, [headingRef, feature, maxCollapsedHeight]);

  return (
    <Drawer
      key={`drawer-${collapsedHeight}px`}
      topOffset={DRAWER_TOP_OFFSET}
      className={DRAWER_CLASSNAME}
      collapsedHeight={collapsedHeight}
      scrollRef={scrollRef}
      onTransitionEnd={(_, open) => setCollapsed(!open)}
    >
      <FeaturePanel headingRef={headingRef} isCollapsed={collapsed} />
    </Drawer>
  );
};
