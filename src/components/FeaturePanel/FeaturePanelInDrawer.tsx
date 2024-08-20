import React from 'react';
import { FeaturePanel } from './FeaturePanel';
import { Drawer } from '../utils/Drawer';
import {
  DRAWER_PREVIEW_HEIGHT,
  DRAWER_TOP_OFFSET,
} from '../utils/MobilePageDrawer';

const DRAWER_CLASSNAME = 'featurePanelInDrawer';

export const FeaturePanelInDrawer = () => (
  <Drawer
    topOffset={DRAWER_TOP_OFFSET}
    className={DRAWER_CLASSNAME}
    collapsedHeight={DRAWER_PREVIEW_HEIGHT}
  >
    <FeaturePanel />
  </Drawer>
);
