import React, { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import CheckIcon from '@mui/icons-material/Check';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
  IconButton,
  Tooltip,
} from '@mui/material';
import { useClimbingContext } from '../contexts/ClimbingContext';
import UndoIcon from '@mui/icons-material/Undo';
import { t } from '../../../../services/intl';
import { useFloatingMenuShortcuts } from './useFloatingMenuShortcuts';
import { PointTypeButtons } from './PointTypeButtons';
import { PointType } from '../types';
import { addShortcutUnderline } from './utils';

const Container = styled.div<{ $isEditMode: boolean }>`
  position: absolute;
  z-index: 1;
  bottom: 4px;
  left: 0;
  right: ${({ $isEditMode }) => ($isEditMode ? 0 : 70)}px;
  overflow: auto;
  padding: 0 12px 8px 12px;
  text-align: right;
  pointer-events: none;
`;

export const RouteFloatingMenu = () => {
  const [isDeletePointDialogVisible, setIsDeletePointDialogVisible] =
    useState(false);
  const [showRouteMarksMenu, setShowRouteMarksMenu] = useState(false);
  const {
    getMachine,
    pointSelectedIndex,
    routes,
    routeSelectedIndex,
    getCurrentPath,
    setRouteIndexHovered,
    setIsRoutesLayerVisible,
    isRoutesLayerVisible,
    isEditMode,
  } = useClimbingContext();
  const path = getCurrentPath();
  const machine = getMachine();

  const isExtendVisible =
    (machine.currentStateName === 'pointMenu' &&
      routes[routeSelectedIndex] &&
      pointSelectedIndex === getCurrentPath().length - 1) ||
    machine.currentStateName === 'editRoute';
  const isDoneVisible = machine.currentStateName === 'extendRoute';
  const isUndoVisible =
    machine.currentStateName === 'extendRoute' && path.length !== 0;

  const onFinishClimbingRouteClick = useCallback(() => {
    machine.execute('finishRoute');
  }, [machine]);
  const onContinueClimbingRouteClick = useCallback(() => {
    machine.execute('extendRoute');
  }, [machine]);
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

      setShowRouteMarksMenu(false);
    },
    [machine],
  );

  const onMouseEnter = () => {
    setRouteIndexHovered(routeSelectedIndex);
  };

  const onMouseLeave = () => {
    setRouteIndexHovered(null);
  };
  const handleUndo = useCallback(
    (e) => {
      machine.execute('undoPoint');
      e.preventDefault();
    },
    [machine],
  );

  useFloatingMenuShortcuts(
    onPointTypeChange,
    onContinueClimbingRouteClick,
    isUndoVisible,
    handleUndo,
    isDoneVisible,
    onFinishClimbingRouteClick,
  );

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
            {t('climbingpanel.delete_point_text')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDeletePointDialog} autoFocus>
            {t('climbingpanel.delete_point_cancel')}
          </Button>
          <Button onClick={onDeletePoint} variant="contained">
            {t('climbingpanel.delete_point_delete')}
          </Button>
        </DialogActions>
      </Dialog>

      <Container $isEditMode={isEditMode}>
        <ButtonGroup
          variant="contained"
          size="small"
          color="primary"
          sx={{ pointerEvents: 'all', gap: 0.5 }}
        >
          {showRouteMarksMenu ? (
            <>
              <Button
                onClick={() => {
                  setShowRouteMarksMenu(false);
                }}
                startIcon={<ArrowBackIcon />}
                sx={{
                  '> *': {
                    margin: 0,
                  },
                }}
              />
              <PointTypeButtons setShowRouteMarksMenu={setShowRouteMarksMenu} />
            </>
          ) : (
            <>
              {isExtendVisible && (
                <Button
                  onClick={onContinueClimbingRouteClick}
                  startIcon={<AddLocationIcon />}
                >
                  {getCurrentPath().length > 0
                    ? addShortcutUnderline(t('climbingpanel.extend'), 'e')
                    : t('climbingpanel.start')}
                </Button>
              )}
              {machine.currentStateName === 'pointMenu' && (
                <Button
                  onClick={() => {
                    setShowRouteMarksMenu(true);
                  }}
                >
                  {t('climbingpanel.type')}
                </Button>
              )}
              {isUndoVisible && (
                <Button
                  onClick={handleUndo}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  startIcon={<UndoIcon fontSize="small" />}
                >
                  {t('climbingpanel.undo')}
                </Button>
              )}
              {machine.currentStateName === 'pointMenu' && (
                <Button
                  onClick={toggleDeletePointDialog}
                  startIcon={<DeleteIcon />}
                  sx={{
                    '> *': {
                      margin: 0,
                    },
                  }}
                />
              )}

              {isDoneVisible && (
                <Button
                  onClick={onFinishClimbingRouteClick}
                  startIcon={<CheckIcon />}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                >
                  {t('climbingpanel.finish_climbing_route')}
                </Button>
              )}
              {!isRoutesLayerVisible && (
                <Tooltip title={t('climbingpanel.show_routes_layer')} arrow>
                  <IconButton
                    color="primary"
                    size="medium"
                    onClick={() => {
                      setIsRoutesLayerVisible(true);
                    }}
                  >
                    <VisibilityOffIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
        </ButtonGroup>
      </Container>
    </>
  );
};
