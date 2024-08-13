import React from 'react';
import styled from '@emotion/styled';
import { Tooltip } from '@mui/material';

type Props = {
  children: string | number;
  isCurrentPhoto: boolean;
  onClick: (e: any) => void;
};

const Container = styled.div<{ $isCurrentPhoto: boolean }>`
  display: block;
  background: ${({ $isCurrentPhoto, theme }) =>
    $isCurrentPhoto ? theme.palette.action.selected : 'transparent'};
  color: ${({ $isCurrentPhoto, theme }) =>
    $isCurrentPhoto ? theme.palette.text.primary : theme.palette.text.hint};
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
  cursor: pointer;
`;

export const PhotoLink = ({ children, isCurrentPhoto, onClick }: Props) => (
  <Tooltip title={`Show photo ${children}`}>
    <Container $isCurrentPhoto={isCurrentPhoto} onClick={onClick}>
      {children}
    </Container>
  </Tooltip>
);
