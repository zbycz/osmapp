import React, { useState } from 'react';

import { SwipeableDrawer } from '@mui/material';
import styled, { createGlobalStyle } from 'styled-components';
import { FeaturePanelInner } from './FeaturePanelInner';
import { Puller } from './helpers/Puller';

const DRAWER_PREVIEW_HEIGHT = 86;
const DRAWER_TOP_OFFSET = 8;
const DRAWER_CLASSNAME = 'featurePanelInDrawer';

const GlobalStyleForDrawer = createGlobalStyle`
  .${DRAWER_CLASSNAME}.MuiDrawer-root > .MuiPaper-root {
    height: calc(100% - ${DRAWER_PREVIEW_HEIGHT}px - ${DRAWER_TOP_OFFSET}px);
    overflow: visible;
  }
`;

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
  height: calc(100% + ${DRAWER_PREVIEW_HEIGHT}px + ${DRAWER_TOP_OFFSET}px);
`;

const ListContainer = styled.div`
  max-height: calc(100% - ${DRAWER_TOP_OFFSET}px);
  height: 100%;
  overflow: auto;
`;

export const FeaturePanelInDrawer = () => {
  const [open, setOpen] = useState(false);

  const handleOnOpen = () => setOpen(true);
  const handleOnClose = () => setOpen(false);

  return (
    <>
      <GlobalStyleForDrawer />
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={handleOnClose}
        onOpen={handleOnOpen}
        swipeAreaWidth={DRAWER_PREVIEW_HEIGHT}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        className={DRAWER_CLASSNAME}
      >
        <Container>
          <Puller setOpen={setOpen} open={open} />
          <ListContainer>
            <FeaturePanelInner />
          </ListContainer>
        </Container>
      </SwipeableDrawer>
    </>
  );
};
