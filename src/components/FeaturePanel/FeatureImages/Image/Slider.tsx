import { PROJECT_ID } from '../../../../services/project';
import styled from '@emotion/styled';
import { IMAGE_HEIGHT } from '../helpers';
import { Scrollbars } from 'react-custom-scrollbars';
import React from 'react';

const isOpenClimbing = PROJECT_ID === 'openclimbing';

export const Wrapper = styled.div`
  width: 100%;
  height: calc(${IMAGE_HEIGHT}px + 10px); // 10px for scrollbar
  min-height: calc(
    ${IMAGE_HEIGHT}px + 10px
  ); // otherwise it shrinks b/c of flex
`;

const StyledScrollbars = styled(Scrollbars)`
  width: 100%;
  height: 100%;
  white-space: nowrap;
  ${!isOpenClimbing && `text-align: center;`} // one image centering

  overflow-y: hidden;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
`;
export const Slider = ({ children }) => (
  <StyledScrollbars universal autoHide suppressHydrationWarning={true}>
    {children}
  </StyledScrollbars>
);
