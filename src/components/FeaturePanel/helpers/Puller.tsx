import styled from '@emotion/styled';
import { grey } from '@mui/material/colors';
import React from 'react';
import { css } from '@emotion/react';
import { isMobileDevice } from '../../helpers';

const HANDLE_WIDTH = 30;
const HANDLE_HIP_SLOP = 10;
const HANDLE_HEIGHT = 6;
export const PULLER_HEIGHT = HANDLE_HEIGHT + HANDLE_HIP_SLOP * 2;

const Handle = styled.div`
  width: ${HANDLE_WIDTH}px;
  height: ${HANDLE_HEIGHT}px;
  margin: auto;
  background-color: ${({ theme }) =>
    theme.palette.mode === 'light' ? grey[300] : grey[900]};
  border-radius: 3px;
  -webkit-tap-highlight-color: transparent;
`;

const PullerContainer = styled.div<{
  $isDesktop: boolean;
  $isClosed: boolean;
}>`
  position: sticky;
  top: 0;
  left: calc(50% - ${HANDLE_WIDTH / 2}px - ${HANDLE_HIP_SLOP}px);
  z-index: 1;
  padding: ${HANDLE_HIP_SLOP}px;

  ${({ $isDesktop, $isClosed }) =>
    $isDesktop &&
    css`
      cursor: pointer;

      &:hover ${Handle} {
        opacity: 0.5;
      }

      ${$isClosed &&
      css`
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: all;
      `}
    `}
`;

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
};

export const Puller = ({ setOpen, open }: Props) => {
  const isDesktop = !isMobileDevice();
  const toggleDrawer = () => {
    setOpen((value) => !value);
  };

  return (
    <PullerContainer
      $isClosed={!open}
      $isDesktop={isDesktop}
      onClick={isDesktop ? toggleDrawer : undefined}
    >
      <Handle />
    </PullerContainer>
  );
};
