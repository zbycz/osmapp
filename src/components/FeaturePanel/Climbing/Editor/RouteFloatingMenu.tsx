import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import CloseIcon from '@material-ui/icons/Close';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Button,
  ButtonGroup,
  FormControl,
  MenuItem,
  Select,
} from '@material-ui/core';
import { useClimbingContext } from '../contexts/ClimbingContext';

export const RouteFloatingMenu = () => {
  const { getMachine } = useClimbingContext();
  const machine = getMachine();

  const onFinishClimbingRouteClick = () => {
    machine.execute('finishRoute');
  };
  const onContinueClimbingRouteClick = () => {
    machine.execute('extendRoute');
  };
  const onDeletePoint = () => {
    machine.execute('deletePoint');
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
      {machine.currentStateName === 'pointMenu' && (
        <Button onClick={() => {}}>Type</Button>
      )}
      {/* {machine.currentStateName === 'pointMenu' && (
        <Button onClick={() => {}} startIcon={<CloseIcon />}>
          Bolt
        </Button>
      )}
      {machine.currentStateName === 'pointMenu' && (
        <Button onClick={() => {}} startIcon={<RemoveCircleIcon />}>
          Belay
        </Button>
      )} */}
      {machine.currentStateName === 'pointMenu' && (
        <Button onClick={onDeletePoint} startIcon={<DeleteIcon />}></Button>
      )}

      {(machine.currentStateName === 'editRoute' ||
        machine.currentStateName === 'extendRoute' ||
        machine.currentStateName === 'pointMenu') && (
        <Button onClick={onFinishClimbingRouteClick} startIcon={<CheckIcon />}>
          Done
        </Button>
      )}
    </ButtonGroup>
  );
};
