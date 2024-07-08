import React from 'react';
import { FeaturePanelInner } from './FeaturePanelInner';
import { Drawer } from '../utils/Drawer';

const DRAWER_CLASSNAME = 'featurePanelInDrawer';
const DRAWER_PREVIEW_HEIGHT = 86;
const DRAWER_TOP_OFFSET = 8;

export const FeaturePanelInDrawer = () => (
  <Drawer
    topOffset={DRAWER_TOP_OFFSET}
    className={DRAWER_CLASSNAME}
    collapsedHeight={DRAWER_PREVIEW_HEIGHT}
  >
    <FeaturePanelInner />
  </Drawer>
);
