import React from 'react';

import { PanelScrollbars, PanelWrapper } from '../utils/PanelHelpers';
import { FeaturePanel } from './FeaturePanel';

export const FeaturePanelOnSide = () => (
  <>
    <PanelWrapper>
      <PanelScrollbars>
        <FeaturePanel />
      </PanelScrollbars>
    </PanelWrapper>
  </>
);
