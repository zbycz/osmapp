import React, { useRef } from 'react';
import styled from 'styled-components';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { ClimbingView } from './ClimbingView';
import { useClimbingContext } from './contexts/ClimbingContext';
import { ClimbingDialogHeader } from './ClimbingDialogHeader';

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const ClimbingDialog = ({
  imageRef,
  isFullscreenDialogOpened,
  setIsFullscreenDialogOpened,
}) => {
  const contentRef = useRef(null);

  const {
    setScrollOffset,
    isPointMoving,
    setIsEditMode,
    isEditMode,
    getMachine,
  } = useClimbingContext();

  const machine = getMachine();
  const onFullscreenDialogClose = () => setIsFullscreenDialogOpened(false);
  const onScroll = (e) => {
    setScrollOffset({
      x: e.target.scrollLeft,
      y: e.target.scrollTop,
      units: 'px',
    });
  };

  const handleSave = () => {
    setIsEditMode(false);
  };
  const onNewRouteCreate = () => {
    machine.execute('createRoute');
  };

  return (
    <Dialog
      fullScreen
      open={isFullscreenDialogOpened}
      onClose={onFullscreenDialogClose}
    >
      <ClimbingDialogHeader
        isFullscreenDialogOpened={isFullscreenDialogOpened}
        setIsFullscreenDialogOpened={setIsFullscreenDialogOpened}
        imageRef={imageRef}
      />

      <DialogContent
        dividers
        style={{
          overscrollBehavior: isPointMoving ? 'none' : undefined,
          padding: 0,
        }}
        ref={contentRef}
        onScroll={onScroll}
      >
        <ClimbingView imageRef={imageRef} />
      </DialogContent>

      {isEditMode && (
        <DialogActions>
          <Flex>
            {isEditMode && (
              <Button
                onClick={onNewRouteCreate}
                color="primary"
                startIcon={<AddIcon />}
              >
                Add new route
              </Button>
            )}
            <div>
              <Button autoFocus onClick={onFullscreenDialogClose}>
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
