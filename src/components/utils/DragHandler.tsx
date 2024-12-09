import styled from '@emotion/styled';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import React from 'react';

const Container = styled.div`
  width: 30px;
  //padding-top: 16px;
  cursor: move;
  align-items: center;
  display: flex;
  color: #888;
`;

export const DragHandler = ({ onDragStart, onDragEnd, onDragOver }) => {
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
