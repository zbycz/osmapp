import React, { useEffect, useState } from 'react';

import { SwipeableDrawer } from '@mui/material';
import styled, { css } from 'styled-components';
import { grey } from '@mui/material/colors';
import { FeaturePanelInner } from './FeaturePanelInner';
import {
  DRAWER_PREVIEW_HEIGHT,
  DRAWER_TOP_OFFSET,
  isMobileDevice,
  useMobileMode,
} from '../helpers';

const StyledSwipeableDrawer = styled(SwipeableDrawer)`
  .MuiDrawer-root > .MuiPaper-root {
    pointer-events: all !important;
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

const PULLER_WIDTH = 30;
const PULLER_HIP_SLOP = 10;

const Puller = styled.div`
  width: ${PULLER_WIDTH}px;
  height: 6px;
  background-color: ${({ theme }) =>
    theme.palette.mode === 'light' ? grey[300] : grey[900]};
  border-radius: 3px;
`;

const PullerContainer = styled.div<{ $isHovered: boolean }>`
  position: absolute;
  z-index: 1;
  top: 0px;
  left: calc(50% - ${PULLER_WIDTH / 2}px - ${PULLER_HIP_SLOP}px);
  padding: ${PULLER_HIP_SLOP}px;
  cursor: pointer;

  ${({ $isHovered }) =>
    $isHovered &&
    css`
      opacity: 0.5;
    `}

  &:hover ${Puller} {
    opacity: 0.5;
  }
`;

const ListContainer = styled('div')(() => ({
  maxHeight: `calc(100% - ${DRAWER_TOP_OFFSET}px)`,
  height: '100%',
  overflow: 'auto',
}));

export const FeaturePanelInDrawer = () => {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasMobileResolution = useMobileMode();
  const isDesktop = !isMobileDevice();

  const handleOnOpen = () => setOpen(true);
  const handleOnClose = () => setOpen(false);

  useEffect(() => {
    if (isDesktop && hasMobileResolution) {
      const swipeAreaElement = document.querySelector('.PrivateSwipeArea-root');

      const handleSwipeAreaClick = () => {
        setOpen(true);
      };
      const handleOnMouseOver = () => {
        setIsHovered(true);
      };
      const handleOnMouseOut = () => {
        setIsHovered(false);
      };

      if (swipeAreaElement) {
        swipeAreaElement.addEventListener('click', handleSwipeAreaClick);
        swipeAreaElement.addEventListener('mouseover', handleOnMouseOver);
        swipeAreaElement.addEventListener('mouseout', handleOnMouseOut);
      }
      return () => {
        if (swipeAreaElement) {
          swipeAreaElement.removeEventListener('click', handleSwipeAreaClick);
          swipeAreaElement.removeEventListener('mouseover', handleOnMouseOver);
          swipeAreaElement.removeEventListener('mouseout', handleOnMouseOut);
        }
      };
    }
    return () => null;
  }, [hasMobileResolution, isDesktop, setIsHovered]);

  return (
    <StyledSwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={handleOnClose}
      onOpen={handleOnOpen}
      style={{
        pointerEvents: 'all',
      }}
      swipeAreaWidth={86}
      disableSwipeToOpen={false}
      ModalProps={{
        keepMounted: true,
      }}
      SwipeAreaProps={{
        cursor: 'pointer',
      }}
      className="featurePanelInDrawer"
    >
      <Container>
        <PullerContainer $isHovered={isHovered}>
          <Puller onClick={handleOnClose} />
        </PullerContainer>
        <ListContainer>
          <FeaturePanelInner />
        </ListContainer>
      </Container>
    </StyledSwipeableDrawer>
  );
};
