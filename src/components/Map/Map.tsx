import React from 'react';

import styled from '@emotion/styled';
import dynamic from 'next/dynamic';
import BugReport from '@mui/icons-material/BugReport';
import { Button, CircularProgress } from '@mui/material';
import { isDesktop, useMobileMode } from '../helpers';
import { MapFooter } from './MapFooter/MapFooter';
import { SHOW_PROTOTYPE_UI } from '../../config.mjs';
import { LayerSwitcherButton } from '../LayerSwitcher/LayerSwitcherButton';
import { MaptilerLogo } from './MapFooter/MaptilerLogo';
import { TopMenu } from './TopMenu/TopMenu';
import { useMapStateContext } from '../utils/MapStateContext';
import { Weather } from './Weather/Weather';
import { MapFilter } from './MapFilter/MapFilter';
import { FEATURE_PANEL_WIDTH } from '../utils/PanelHelpers';
import { usePanelShown } from '../utils/usePanelShown';

const BrowserMapDynamic = dynamic(() => import('./BrowserMap'), {
  ssr: false,
  loading: () => <div />,
});

const LayerSwitcherDynamic = dynamic(
  () => import('../LayerSwitcher/LayerSwitcher'),
  {
    ssr: false,
    loading: () => <LayerSwitcherButton />,
  },
);

const Spinner = styled(CircularProgress)`
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -20px 0 0 -20px;
`;

const TopRight = styled.div`
  position: absolute;
  z-index: 1000;
  padding: 10px;
  right: 0;
  top: 62px;

  @media ${isDesktop} {
    top: 0;
  }
`;

const BottomRight = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1000;
  text-align: right;
  pointer-events: none;
  z-index: 999;

  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: end;
  padding: 0 4px 4px 4px;
`;

const BottomCenter = styled.div<{ $isFeaturePanelVisible: boolean }>`
  position: absolute;
  right: 0;
  pointer-events: none;
  z-index: 1000;
  width: calc(
    100% -
      ${({ $isFeaturePanelVisible }) =>
        $isFeaturePanelVisible ? `${FEATURE_PANEL_WIDTH}px` : '0px'}
  );
  height: 100px;
  bottom: 0;
  text-align: center;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 4px 4px 4px;
`;

const BugReportButton = () => (
  <Button size="small">
    <BugReport width="10" height="10" />
    Nahlásit chybu v mapě
  </Button>
);

const NoscriptMessage = () => (
  <noscript>
    <span style={{ position: 'absolute', left: '50%', top: '50%' }}>
      This map needs Javascript.
    </span>
  </noscript>
);

const Map = () => {
  const { mapLoaded, activeLayers } = useMapStateContext();
  const isMobileMode = useMobileMode();
  const hasClimbingLayer = activeLayers.includes('climbing');
  const isPanelShown = usePanelShown();

  return (
    <>
      <BrowserMapDynamic />
      {!mapLoaded && <Spinner color="secondary" />}
      <NoscriptMessage />
      <TopRight>
        <TopMenu />
        <LayerSwitcherDynamic />
      </TopRight>
      <BottomRight>
        {SHOW_PROTOTYPE_UI && <BugReportButton />}
        <MaptilerLogo />
        <Weather />
        <MapFooter />
      </BottomRight>
      {hasClimbingLayer && (
        <BottomCenter $isFeaturePanelVisible={isPanelShown && !isMobileMode}>
          <MapFilter />
        </BottomCenter>
      )}
    </>
  );
};

export default Map;
