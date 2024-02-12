import React, { useState } from 'react';
import styled from 'styled-components';
import CheckIcon from '@material-ui/icons/Check';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
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
import { PointType } from '../types';

const ScaleContainer = styled.div<{ scale: number }>`
  transform: scale(${({ scale }) => 1 / scale});
`;

export const RouteFloatingMenu = () => {
  const [isDeletePointDialogVisible, setIsDeletePointDialogVisible] =
    useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const {
    getMachine,
    pointSelectedIndex,
    routes,
    routeSelectedIndex,
    getCurrentPath,
    photoZoom,
  } = useClimbingContext();
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

  const onPointTypeChange = (type: PointType) => {
    machine.execute('changePointType', { type });

    setShowTypeMenu(false);
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

      {showTypeMenu ? (
        <ScaleContainer scale={photoZoom.scale}>
          <ButtonGroup variant="contained" size="small" color="primary">
            <Button
              onClick={() => {
                setShowTypeMenu(false);
              }}
              startIcon={<ArrowBackIcon />}
            />
            <Button
              onClick={() => {
                onPointTypeChange('bolt');
              }}
            >
              Bolt
            </Button>
            <Button
              onClick={() => {
                onPointTypeChange('anchor');
              }}
            >
              Belay
            </Button>
            <Button
              onClick={() => {
                onPointTypeChange('sling');
              }}
            >
              Sling
            </Button>
            <Button
              onClick={() => {
                onPointTypeChange('piton');
              }}
            >
              Piton
            </Button>
            <Button
              onClick={() => {
                onPointTypeChange(null);
              }}
            >
              None
            </Button>
          </ButtonGroup>
        </ScaleContainer>
      ) : (
        <ScaleContainer scale={photoZoom.scale}>
          <ButtonGroup variant="contained" size="small" color="primary">
            {machine.currentStateName === 'pointMenu' &&
              routes[routeSelectedIndex] &&
              pointSelectedIndex === getCurrentPath().length - 1 && (
                <Button
                  onClick={onContinueClimbingRouteClick}
                  startIcon={<AddLocationIcon />}
                >
                  Extend
                </Button>
              )}
            {machine.currentStateName === 'pointMenu' && (
              <Button
                onClick={() => {
                  setShowTypeMenu(true);
                }}
              >
                Type
              </Button>
            )}

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
        </ScaleContainer>
      )}
    </>
  );
};
