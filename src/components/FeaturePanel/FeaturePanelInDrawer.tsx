import React, { useState } from 'react';

import { SwipeableDrawer, useTheme } from '@mui/material';
import styled from 'styled-components';
import { grey } from '@mui/material/colors';
import { FeaturePanel } from './FeaturePanel';

const Puller = styled.div`
  width: 30px;
  height: 6px;
  background-color: ${({ theme }) =>
    theme.palette.mode === 'light' ? grey[300] : grey[900]};
  border-radius: 3px;
  position: absolute;
  top: 8px;
  left: calc(50% - 15px);
`;

const ListContainer = styled('div')(() => ({
  maxHeight: '90vh',
  overflow: 'auto',
}));

export const FeaturePanelInDrawer = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => {
        setOpen(true);
      }}
      swipeAreaWidth={72}
      disableSwipeToOpen={false}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <div
        style={{
          position: 'relative',
          background: theme.palette.background.paper,
          marginTop: `-72px`,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          visibility: 'visible',
          right: 0,
          left: 0,
        }}
      >
        <Puller />
        <ListContainer>
          <FeaturePanel />
        </ListContainer>
      </div>
    </SwipeableDrawer>
  );
};
