import UndoIcon from '@mui/icons-material/Undo';
import React from 'react';
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import { useClimbingContext } from '../contexts/ClimbingContext';

const Container = styled.div`
  background: ${({ theme }) => theme.palette.background.default};
  border-radius: 8px;
  position: absolute;
  width: 44px;
  top: 5px;
  left: 5px;
  z-index: 1;
`;

export const ControlPanel = () => {
  const { getMachine, getCurrentPath } = useClimbingContext();
  const machine = getMachine();

  const onUndoClick = () => {
    machine.execute('undoPoint');
  };

  const path = getCurrentPath();

  return (
    <Container>
      {machine.currentStateName === 'extendRoute' && path.length !== 0 && (
        <IconButton
          color="default"
          edge="end"
          onClick={onUndoClick}
          title="Undo last segment"
        >
          <UndoIcon fontSize="small" />
        </IconButton>
      )}
    </Container>
  );
};
