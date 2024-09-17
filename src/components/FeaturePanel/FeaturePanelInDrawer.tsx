import React from 'react';
import { FeaturePanel } from './FeaturePanel';
import { Drawer } from '../utils/Drawer';
import {
  DRAWER_PREVIEW_HEIGHT,
  DRAWER_PREVIEW_PADDING,
  DRAWER_TOP_OFFSET,
} from '../utils/MobilePageDrawer';

const DRAWER_CLASSNAME = 'featurePanelInDrawer';

export const FeaturePanelInDrawer = () => {
  const [height, setHeight] = React.useState(DRAWER_PREVIEW_HEIGHT);
  return (
    <Drawer
      key={`drawer-${height}px`}
      topOffset={DRAWER_TOP_OFFSET}
      className={DRAWER_CLASSNAME}
      collapsedHeight={height}
    >
      <FeaturePanel
        onHeadingHeightChange={(height) => {
          setHeight(height + DRAWER_PREVIEW_PADDING);
        }}
      />
    </Drawer>
  );
};
