/* eslint-disable react/jsx-props-no-spreading */
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import React, { LegacyRef, useState } from 'react';
import { SwipeableDrawer } from '@mui/material';
import { Puller } from '../FeaturePanel/helpers/Puller';
import { Scrollbars } from 'react-custom-scrollbars';

type SettingsProps = {
  $collapsedHeight: number;
  $topOffset: number;
};

const getPaperStyle = (className: string, offset: number) => css`
  .${className}.MuiDrawer-root > .MuiPaper-root {
    height: calc(100% - ${offset}px);
    overflow: visible;
    background-color: transparent;
  }
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

type Props = {
  onTransitionEnd?: (
    e: React.TransitionEvent<HTMLDivElement>,
    open: boolean,
  ) => void;
  children: React.ReactNode;
  topOffset: number;
  collapsedHeight: number;
  className: string;
  defaultOpen?: boolean;
  scrollRef?: LegacyRef<Scrollbars>;
};

export const Drawer = ({
  children,
  topOffset,
  collapsedHeight,
  className,
  onTransitionEnd,
  defaultOpen = false,
  scrollRef,
}: Props) => {
  const newRef = React.useRef<Scrollbars>(null);
  const ref = scrollRef || newRef;
  const [open, setOpen] = useState(defaultOpen);

  const handleOnOpen = () => setOpen(true);
  const handleOnClose = () => setOpen(false);

  return (
    <>
      <Global styles={getPaperStyle(className, collapsedHeight + topOffset)} />
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
        <Container $collapsedHeight={collapsedHeight} $topOffset={topOffset}>
          <Puller setOpen={setOpen} open={open} />
          <Scrollbars universal autoHide style={{ height: '100%' }} ref={ref}>
            {children}
          </Scrollbars>
        </Container>
      </SwipeableDrawer>
    </>
  );
};
