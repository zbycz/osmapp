import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import { Button } from '@material-ui/core';
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
    <>
      {machine.currentStateName === 'extendRoute' && (
        <Button
          color="primary"
          variant="contained"
          onClick={onFinishClimbingRouteClick}
          size="small"
          startIcon={<CheckIcon />}
        >
          Done
        </Button>
      )}
      {machine.currentStateName === 'editRoute' && (
        <Button
          color="primary"
          variant="contained"
          onClick={onContinueClimbingRouteClick}
          size="small"
          startIcon={<AddLocationIcon />}
        >
          Continue
        </Button>
      )}
    </>
  );
};
