/* eslint-disable react/jsx-props-no-spreading */
import styled, { createGlobalStyle, css } from 'styled-components';
import React, { useState } from 'react';
import { SwipeableDrawer } from '@mui/material';
import { Puller } from '../FeaturePanel/helpers/Puller';

type SettingsProps = {
  $collapsedHeight: number;
  $topOffset: number;
};

const GlobalStyleForDrawer = createGlobalStyle<
  SettingsProps & {
    className: string;
  }
>`
  ${({ className, $collapsedHeight, $topOffset }) => css`
    .${className}.MuiDrawer-root > .MuiPaper-root {
      height: calc(100% - ${$collapsedHeight}px - ${$topOffset}px);
      overflow: visible;
      background-color: transparent;
    }
  `}

`;

const Container = styled.div<SettingsProps>`
  position: relative;
  background: ${({ theme }) => theme.palette.background.paper};
  margin-top: -${({ $collapsedHeight }) => $collapsedHeight}px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  visibility: visible;
  right: 0;
  left: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  height: calc(
    100% + ${({ $collapsedHeight }) => $collapsedHeight}px +
      ${({ $topOffset }) => $topOffset}px
  );
  overflow: hidden;
`;

const ListContainer = styled.div`
  height: 100%;
  overflow: auto;
`;

type Props = {
  onTransitionEnd?: (e: any, open: boolean) => void;
  children: React.ReactNode;
  topOffset: number;
  collapsedHeight: number;
  className: string;
  defaultOpen?: boolean;
};

export const Drawer = ({
  children,
  topOffset,
  collapsedHeight,
  className,
  onTransitionEnd,
  defaultOpen = false,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  const handleOnOpen = () => setOpen(true);
  const handleOnClose = () => setOpen(false);

  const commonProps = {
    $collapsedHeight: collapsedHeight,
    $topOffset: topOffset,
  };
  return (
    <>
      <GlobalStyleForDrawer {...commonProps} className={className} />
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={handleOnClose}
        onOpen={handleOnOpen}
        swipeAreaWidth={collapsedHeight}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        className={className}
        onTransitionEnd={(e) => {
          onTransitionEnd?.(e, open);
        }}
      >
        <Container {...commonProps}>
          <Puller setOpen={setOpen} open={open} />
          <ListContainer>{children}</ListContainer>
        </Container>
      </SwipeableDrawer>
    </>
  );
};
