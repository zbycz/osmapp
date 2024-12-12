import styled from '@emotion/styled';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import React from 'react';

const Container = styled.div`
  width: 30px;
  cursor: move;
  align-items: center;
  display: flex;
  color: #888;
`;

type DragHandlerProps = {
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
};

export const DragHandler = ({
  onDragStart,
  onDragEnd,
  onDragOver,
}: DragHandlerProps) => {
  return (
    <Container
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <DragIndicatorIcon />
    </Container>
  );
};
