import React from 'react';
import { Drawer } from './Drawer';
import { PanelWrapper } from './PanelHelpers';
import { useMobileMode } from '../helpers';

export const DRAWER_PREVIEW_PADDING = 24;
export const DRAWER_PREVIEW_HEIGHT = 62 + DRAWER_PREVIEW_PADDING;
export const DRAWER_TOP_OFFSET = 8;

type MobilePageDrawerProps = {
  children: React.ReactNode;
  onClose?: (e: React.TransitionEvent<HTMLDivElement>, open: boolean) => void;
  className: string;
  collapsedHeight?: number;
  topOffset?: number;
};

export const MobilePageDrawer = ({
  children,
  onClose,
  className,
  collapsedHeight = DRAWER_PREVIEW_HEIGHT,
  topOffset = DRAWER_TOP_OFFSET,
}: MobilePageDrawerProps) => {
  const isMobileMode = useMobileMode();

  return isMobileMode ? (
    <Drawer
      topOffset={topOffset}
      className={className}
      collapsedHeight={collapsedHeight}
      onTransitionEnd={onClose}
      defaultOpen
    >
      {children}
    </Drawer>
  ) : (
    <PanelWrapper>{children}</PanelWrapper>
  );
};
