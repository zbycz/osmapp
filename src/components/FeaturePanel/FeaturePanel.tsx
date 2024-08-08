import React from 'react';

import { PanelScrollbars, PanelWrapper } from '../utils/PanelHelpers';
import { FeaturePanelInner } from './FeaturePanelInner';

export const FeaturePanel = () => (
  <PanelWrapper>
    <PanelScrollbars>
      <FeaturePanelInner />
    </PanelScrollbars>
  </PanelWrapper>
);
