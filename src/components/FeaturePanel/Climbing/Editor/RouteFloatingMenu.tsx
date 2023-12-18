import React, { useState } from 'react';
import CheckIcon from '@material-ui/icons/Check';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { useClimbingContext } from '../contexts/ClimbingContext';

export const RouteFloatingMenu = () => {
  const [isDeletePointDialogVisible, setIsDeletePointDialogVisible] =
    useState(false);
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
    setIsDeletePointDialogVisible(false);
  };

  const toggleDeletePointDialog = () => {
    setIsDeletePointDialogVisible(!isDeletePointDialogVisible);
  };

  return (
    <>
      <Dialog
        open={isDeletePointDialogVisible}
        onClose={toggleDeletePointDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete point?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete this point?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDeletePointDialog} autoFocus>
            Cancel
          </Button>
          <Button onClick={onDeletePoint} variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
          <Button
            onClick={toggleDeletePointDialog}
            startIcon={<DeleteIcon />}
          />
        )}

        {machine.currentStateName === 'extendRoute' && (
          <Button
            onClick={onFinishClimbingRouteClick}
            startIcon={<CheckIcon />}
          >
            Done
          </Button>
        )}
      </ButtonGroup>
    </>
  );
};
