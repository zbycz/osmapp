import React from 'react';
import { SwipeableDrawer, useMediaQuery } from '@mui/material';
import { isDesktop, useBoolState } from '../helpers';
import { LayerSwitcherButton } from './LayerSwitcherButton';
import { LayerSwitcherContent } from './LayerSwitcherContent';
import { ClosePanelButton } from '../utils/ClosePanelButton';

const LayerSwitcher = () => {
  const [opened, open, close] = useBoolState(false);
  const panelFixed = useMediaQuery(isDesktop);

  return (
    <>
      <LayerSwitcherButton onClick={opened ? close : open} isOpened={opened} />
      <SwipeableDrawer
        anchor="right"
        open={opened}
        onClose={close}
        onOpen={open}
        variant={panelFixed ? 'persistent' : 'temporary'}
        disableBackdropTransition
        disableSwipeToOpen
        sx={{ pointerEvents: 'all' }}
      >
        <div role="presentation" style={{ width: '280px', height: '100%' }}>
          <ClosePanelButton right onClick={close} style={{ top: 13 }} />
          <LayerSwitcherContent />
        </div>
      </SwipeableDrawer>
    </>
  );
};

export default LayerSwitcher; // default-export needed by dynamic-import
