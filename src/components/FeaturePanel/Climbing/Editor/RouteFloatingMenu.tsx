import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, ButtonGroup } from '@material-ui/core';
import { useClimbingContext } from '../contexts/ClimbingContext';

export const RouteFloatingMenu = () => {
  const { getMachine, pointSelectedIndex, routes, routeSelectedIndex } =
    useClimbingContext();
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
      {machine.currentStateName === 'pointMenu' &&
        routes[routeSelectedIndex] &&
        pointSelectedIndex === routes[routeSelectedIndex].path.length - 1 && (
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
        <Button onClick={onDeletePoint} startIcon={<DeleteIcon />} />
      )}

      {machine.currentStateName === 'extendRoute' && (
        <Button onClick={onFinishClimbingRouteClick} startIcon={<CheckIcon />}>
          Done
        </Button>
      )}
    </ButtonGroup>
  );
};
