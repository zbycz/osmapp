import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import CloseIcon from '@material-ui/icons/Close';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { ClimbingView } from './ClimbingView';
import { useClimbingContext } from './contexts/ClimbingContext';
import { PanelScrollbars, PanelWrapper } from '../../utils/PanelHelpers';

const ShowFullscreenContainer = styled.div`
  padding: 10px;
  overflow: auto;
`;
const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
const Title = styled.div`
  flex: 1;
`;

export const ClimbingPanel = () => {
  const contentRef = useRef(null);
  const [isFullscreenDialogOpened, setIsFullscreenDialogOpened] =
    useState<boolean>(false);

  const {
    setScrollOffset,
    isPointMoving,
    areRoutesVisible,
    setAreRoutesVisible,
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
  const VisibilityIconElement = areRoutesVisible
    ? VisibilityOffIcon
    : VisibilityIcon;

  return (
    <>
      <PanelWrapper>
        <PanelScrollbars>
          <Dialog
            fullScreen
            open={isFullscreenDialogOpened}
            onClose={onFullscreenDialogClose}
          >
            <AppBar position="static" color="transparent">
              <Toolbar variant="dense">
                <Title>
                  <Typography variant="h6" component="div">
                    Roviště
                  </Typography>
                </Title>
                <>
                  <IconButton
                    color="primary"
                    edge="end"
                    title={areRoutesVisible ? 'Hide routes' : 'Show routes'}
                    onClick={() => {
                      setAreRoutesVisible(!areRoutesVisible);
                    }}
                  >
                    <VisibilityIconElement fontSize="small" />
                  </IconButton>
                </>
                {isFullscreenDialogOpened && (
                  <IconButton
                    color="primary"
                    edge="end"
                    onClick={() => {
                      setIsFullscreenDialogOpened(!isFullscreenDialogOpened);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Toolbar>
            </AppBar>

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
