import UndoIcon from '@mui/icons-material/Undo';
import React from 'react';
import styled from '@emotion/styled';
import { IconButton, useTheme } from '@mui/material';
import { useClimbingContext } from '../contexts/ClimbingContext';

const Container = styled.div`
  position: absolute;
  width: 36px;
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
  const theme = useTheme();

  return (
    <Container>
      {machine.currentStateName === 'extendRoute' && path.length !== 0 && (
        <IconButton
          color="default"
          edge="end"
          onClick={onUndoClick}
          title="Undo last segment"
          sx={{
            backgroundColor: theme.palette.background.default,
            '&:hover': {
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          <UndoIcon fontSize="small" />
        </IconButton>
      )}
    </Container>
  );
};
