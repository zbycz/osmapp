import React, { useRef } from 'react';
import styled from 'styled-components';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Router from 'next/router';
import { ClimbingView } from './ClimbingView';
import { useClimbingContext } from './contexts/ClimbingContext';
import { ClimbingDialogHeader } from './ClimbingDialogHeader';
import { getOsmappLink } from '../../../services/helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useGetHandleSave } from './useGetHandleSave';

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const ClimbingDialog = ({ photoIndex }: { photoIndex?: number }) => {
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

  const machine = getMachine();

  const onScroll = (e) => {
    setScrollOffset({
      x: e.target.scrollLeft,
      y: e.target.scrollTop,
      units: 'px',
    });
  };

  const handleClose = () => {
    Router.push(`${getOsmappLink(feature)}${window.location.hash}`);
  };

  const onNewRouteCreate = () => {
    machine.execute('createRoute');
  };

  return (
    <Dialog fullScreen open onClose={handleClose}>
      <ClimbingDialogHeader onClose={handleClose} />

      <DialogContent
        dividers
        style={{
          overscrollBehavior: isPointMoving ? 'none' : undefined,
          padding: 0,
        }}
        ref={contentRef}
        onScroll={onScroll}
      >
        <ClimbingView photoIndex={photoIndex} />
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
              <Button autoFocus onClick={handleClose}>
                Cancel
              </Button>
              {showDebugMenu && (
                <Button
                  onClick={handleSave}
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
              )}
            </div>
          </Flex>
        </DialogActions>
      )}
    </Dialog>
  );
};
