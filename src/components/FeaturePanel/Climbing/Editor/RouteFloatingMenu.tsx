import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import { Button, ButtonGroup } from '@material-ui/core';
import { useClimbingContext } from '../contexts/ClimbingContext';

export const RouteFloatingMenu = () => {
  const { useMachine } = useClimbingContext();
  const machine = useMachine();

  const onFinishClimbingRouteClick = () => {
    machine.execute('finishRoute');
  };
  const onContinueClimbingRouteClick = () => {
    machine.execute('extendRoute');
  };

  return (
    <ButtonGroup variant="contained" size="small" color="primary">
      {machine.currentStateName === 'editRoute' && (
        <Button
          onClick={onContinueClimbingRouteClick}
          startIcon={<AddLocationIcon />}
        >
          Extend
        </Button>
      )}
      {(machine.currentStateName === 'editRoute' ||
        machine.currentStateName === 'extendRoute') && (
        <Button onClick={onFinishClimbingRouteClick} startIcon={<CheckIcon />}>
          Done
        </Button>
      )}
    </ButtonGroup>
  );
};
