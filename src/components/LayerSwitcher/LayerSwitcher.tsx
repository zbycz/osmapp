import React from 'react';
import { SwipeableDrawer } from '@material-ui/core';
import { useBoolState } from '../helpers';
import { LayerSwitcherButton } from './LayerSwitcherButton';
import { LayerSwitcherContent } from './LayerSwitcherContent';
import { ClosePanelButton } from '../utils/ClosePanelButton';

const LayerSwitcher = () => {
  const [opened, open, close] = useBoolState(false);

  return (
    <>
      <LayerSwitcherButton onClick={open} />
      <SwipeableDrawer
        anchor="right"
        open={opened}
        onClose={close}
        onOpen={open}
        variant="persistent"
        disableBackdropTransition
      >
        <div role="presentation" style={{ width: '280px', height: '100%' }}>
          <ClosePanelButton right onClick={close} />
          <LayerSwitcherContent />
        </div>
      </SwipeableDrawer>
    </>
  );
};

export default LayerSwitcher; // default-export needed by dynamic-import
