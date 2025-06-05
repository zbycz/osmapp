import React from 'react';
import {
  SwipeableDrawer,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
} from '@mui/material';
import { isDesktop, useBoolState, useMobileMode } from '../helpers';
import { LayerSwitcherButton } from './LayerSwitcherButton';
import { LayerSwitcherContent } from './LayerSwitcherContent';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { useClimbingFiltersContext } from '../utils/ClimbingFiltersContext';
import { useMapStateContext } from '../utils/MapStateContext';
import { useFeatureContext } from '../utils/FeatureContext';
import { gymsLayer } from '../Map/climbingTiles/climbingLayers/groupsLayer';
import { getGlobalMap } from '../../services/mapStorage';

const ClimbingFilters = () => {
  const map = getGlobalMap();
  const { type, setType } = useClimbingFiltersContext();
  return (
    <ToggleButtonGroup
      value={type}
      onChange={(_e, type) => {
        // setType(type);
        map.addLayer(gymsLayer);
      }}
    >
      <ToggleButton value="rockClimbing">Rock climbing</ToggleButton>
      <ToggleButton value="gym">Indoor climbing</ToggleButton>
      <ToggleButton value="viaFerrata">Via ferrata</ToggleButton>
    </ToggleButtonGroup>
  );
};

const LayerSwitcher = () => {
  const [opened, open, close] = useBoolState(false);
  const panelFixed = useMediaQuery(isDesktop);
  const { activeLayers } = useMapStateContext();

  const hasClimbingLayer = activeLayers.includes('climbing');

  return (
    <>
      <LayerSwitcherButton onClick={open} />
      <SwipeableDrawer
        anchor="right"
        open={opened}
        onClose={close}
        onOpen={open}
        variant={panelFixed ? 'persistent' : 'temporary'}
        disableBackdropTransition
        disableSwipeToOpen
      >
        <div role="presentation" style={{ width: '280px', height: '100%' }}>
          <ClosePanelButton right onClick={close} style={{ top: 13 }} />
          <LayerSwitcherContent />
        </div>
        {hasClimbingLayer && <ClimbingFilters />}
      </SwipeableDrawer>
    </>
  );
};

export default LayerSwitcher; // default-export needed by dynamic-import
