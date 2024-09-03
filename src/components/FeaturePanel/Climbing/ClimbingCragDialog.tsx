import React, { useRef } from 'react';
import styled from '@emotion/styled';
import AddIcon from '@mui/icons-material/Add';
import Router from 'next/router';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import { ClimbingView } from './ClimbingView';
import { useClimbingContext } from './contexts/ClimbingContext';
import { ClimbingCragDialogHeader } from './ClimbingCragDialogHeader';
import { getOsmappLink } from '../../../services/helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useGetHandleSave } from './useGetHandleSave';

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const ClimbingCragDialog = ({ photo }: { photo?: string }) => {
  const contentRef = useRef(null);

  const {
    setScrollOffset,
    isPointMoving,
    setIsEditMode,
    isEditMode,
    getMachine,
    showDebugMenu,
  } = useClimbingContext();
  const { feature } = useFeatureContext();
  const handleSave = useGetHandleSave(setIsEditMode);
  // const { routes } = useClimbingContext();
  const machine = getMachine();

  const onScroll = (e) => {
    setScrollOffset({
      x: e.target.scrollLeft,
      y: e.target.scrollTop,
      units: 'px',
    });
  };

  const handleClose = () => {
    if (
      isEditMode &&
      window.confirm(
        'Are you sure you want to close this window? You might loose your changes.',
      ) === false
    ) {
      return;
    }

    Router.push(`${getOsmappLink(feature)}${window.location.hash}`);
  };
  const handleCancel = () => {
    setIsEditMode(false);
  };

  const onNewRouteCreate = () => {
    machine.execute('createRoute');
  };

  return (
    <Dialog fullScreen open onClose={handleClose}>
      <ClimbingCragDialogHeader onClose={handleClose} />

      <DialogContent
        dividers
        style={{
          overscrollBehavior: isPointMoving ? 'none' : undefined,
          padding: 0,
        }}
        ref={contentRef}
        onScroll={onScroll}
      >
        <ClimbingView photo={photo} />
      </DialogContent>

      {isEditMode && (
        <DialogActions>
          <Flex>
            <div>
              {isEditMode && showDebugMenu && (
                <Button
                  onClick={onNewRouteCreate}
                  color="primary"
                  startIcon={<AddIcon />}
                >
                  Add new route
                </Button>
              )}
            </div>
            <div>
              <Button autoFocus onClick={handleCancel}>
                Cancel
              </Button>

              <Button onClick={handleSave} variant="contained" color="primary">
                Save
              </Button>
            </div>
          </Flex>
        </DialogActions>
      )}
    </Dialog>
  );
};
