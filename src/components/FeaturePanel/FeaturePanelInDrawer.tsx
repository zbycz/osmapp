import React, { useState } from 'react';

import { SwipeableDrawer } from '@mui/material';
import styled from 'styled-components';
import { grey } from '@mui/material/colors';
import { FeaturePanelInner } from './FeaturePanelInner';

const Container = styled.div`
  position: relative;
  background: ${({ theme }) => theme.palette.background.paper};
  margin-top: -86px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  visibility: visible;
  right: 0;
  left: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  height: 100%;
`;

const Puller = styled.div`
  width: 30px;
  height: 6px;
  background-color: ${({ theme }) =>
    theme.palette.mode === 'light' ? grey[300] : grey[900]};
  border-radius: 3px;
  position: absolute;
  pointer-events: none;
  top: 8px;
  left: calc(50% - 15px);
`;

const ListContainer = styled('div')(() => ({
  maxHeight: 'calc(100% - 8px)',
  height: '100%',
  overflow: 'auto',
}));

export const FeaturePanelInDrawer = () => {
  const [open, setOpen] = useState(false);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => {
        setOpen(true);
      }}
      swipeAreaWidth={86}
      disableSwipeToOpen={false}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Container>
        <Puller />
        <ListContainer>
          <FeaturePanelInner />
        </ListContainer>
      </Container>
    </SwipeableDrawer>
  );
};
