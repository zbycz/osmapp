import React from 'react';
import styled from '@emotion/styled';
import { Tooltip } from '@mui/material';

type Props = {
  children: string | number;
  isCurrentPhoto: boolean;
  onClick: (e: any) => void;
  onDragStart?: (e: any) => void;
  onDragOver?: (e: any) => void;
  onDragEnd?: (e: any) => void;
  draggable?: boolean;
  photo: string;
};

const Container = styled.div<{ $isCurrentPhoto: boolean; draggable?: boolean }>`
  display: block;
  background: ${({ $isCurrentPhoto, theme }) =>
    $isCurrentPhoto ? theme.palette.action.selected : 'transparent'};
  color: ${({ $isCurrentPhoto, theme }) =>
    $isCurrentPhoto
      ? theme.palette.text.primary
      : theme.palette.text.secondary};
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
  cursor: ${({ draggable }) => (draggable ? 'move' : 'pointer')};
  &[draggable='true'] {
    opacity: 0.8;
  }
`;

export const PhotoLink = ({
  children,
  isCurrentPhoto,
  onClick,
  onDragStart,
  onDragOver,
  onDragEnd,
  draggable,
  photo,
}: Props) => {
  return (
    <Tooltip title={`Show photo ${children} (${photo})`}>
      <Container
        $isCurrentPhoto={isCurrentPhoto}
        onClick={onClick}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        draggable={draggable}
      >
        {children}
      </Container>
    </Tooltip>
  );
};
