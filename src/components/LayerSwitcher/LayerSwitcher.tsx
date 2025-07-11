import React from 'react';
import styled from '@emotion/styled';
import { SwipeableDrawer, useMediaQuery } from '@mui/material';
import { isDesktop, useBoolState } from '../helpers';
import { LayerSwitcherButton } from './LayerSwitcherButton';
import { LayerSwitcherContent } from './LayerSwitcherContent';
import { ClosePanelButton } from '../utils/ClosePanelButton';

const Wrapper = styled.div`
  width: calc(280px + var(--safe-left));
  margin-top: var(--safe-top);
  margin-bottom: var(--safe-bottom);
  position: relative;
`;

const LayerSwitcher = () => {
  const [opened, open, close] = useBoolState(false);
  const panelFixed = useMediaQuery(isDesktop);

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
        <Wrapper role="presentation">
          <ClosePanelButton
            right="var(--safe-right)"
            onClick={close}
            style={{ top: '13px' }}
          />
          <LayerSwitcherContent />
        </Wrapper>
      </SwipeableDrawer>
    </>
  );
};

export default LayerSwitcher; // default-export needed by dynamic-import
