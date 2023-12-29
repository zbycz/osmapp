import React, { useEffect, useRef, useState } from 'react';
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
import { PanelScrollbars, PanelWrapper } from '../../utils/PanelHelpers';
import { ClimbingDialogHeader } from './ClimbingDialogHeader';

const ShowFullscreenContainer = styled.div`
  padding: 10px;
  overflow: auto;
`;
const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const ClimbingPanel = () => {
  const contentRef = useRef(null);
  const [isFullscreenDialogOpened, setIsFullscreenDialogOpened] =
    useState<boolean>(false);

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

  useEffect(() => {
    if (!isFullscreenDialogOpened) {
      setIsEditMode(false);
    }
  }, [isFullscreenDialogOpened]);
  const handleSave = () => {
    setIsEditMode(false);
  };
  const onNewRouteCreate = () => {
    machine.execute('createRoute');
  };

  return (
    <>
      <PanelWrapper>
        <PanelScrollbars>
          <Dialog
            fullScreen
            open={isFullscreenDialogOpened}
            onClose={onFullscreenDialogClose}
          >
            <ClimbingDialogHeader
              isFullscreenDialogOpened={isFullscreenDialogOpened}
              setIsFullscreenDialogOpened={setIsFullscreenDialogOpened}
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
              <ClimbingView />
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
                    <Button
                      onClick={handleSave}
                      variant="contained"
                      color="primary"
                    >
                      Save
                    </Button>
                  </div>
                </Flex>
              </DialogActions>
            )}
          </Dialog>

          {!isFullscreenDialogOpened && <ClimbingView fixedHeight={238} />}

          <ShowFullscreenContainer>
            <Button
              onClick={() => setIsFullscreenDialogOpened(true)}
              color="primary"
              size="small"
              variant="contained"
            >
              Show fullscreen
            </Button>
          </ShowFullscreenContainer>
        </PanelScrollbars>
      </PanelWrapper>
    </>
  );
};
