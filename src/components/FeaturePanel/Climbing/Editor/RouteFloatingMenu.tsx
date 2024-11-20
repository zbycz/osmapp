import React, { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import CheckIcon from '@mui/icons-material/Check';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ButtonGroup,
} from '@mui/material';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { PointType } from '../types';

const Container = styled.div`
  position: absolute;
  z-index: 1;
  bottom: 16px;
  right: 16px;
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
    setRouteIndexHovered,
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

  const onPointTypeChange = useCallback(
    (type: PointType) => {
      machine.execute('changePointType', { type });

      setShowTypeMenu(false);
    },
    [machine],
  );

  const onMouseEnter = () => {
    setRouteIndexHovered(routeSelectedIndex);
  };

  const onMouseLeave = () => {
    setRouteIndexHovered(null);
  };

  React.useEffect(() => {
    const downHandler = (e) => {
      if (e.key === 'b') {
        onPointTypeChange('bolt');
      }
      if (e.key === 'a') {
        onPointTypeChange('anchor');
      }
      if (e.key === 's') {
        onPointTypeChange('sling');
      }
      if (e.key === 'p') {
        onPointTypeChange('piton');
      }
      if (e.key === 'u') {
        onPointTypeChange('unfinished');
      }
      if (e.key === 'n') {
        onPointTypeChange(null);
      }
    };

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [onPointTypeChange]);

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

      <Container>
        {showTypeMenu ? (
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
              Anchor
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
                onPointTypeChange('unfinished');
              }}
            >
              Unfinished
            </Button>
            <Button
              onClick={() => {
                onPointTypeChange(null);
              }}
            >
              None
            </Button>
          </ButtonGroup>
        ) : (
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
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                Done
              </Button>
            )}
          </ButtonGroup>
        )}
      </Container>
    </>
  );
};
