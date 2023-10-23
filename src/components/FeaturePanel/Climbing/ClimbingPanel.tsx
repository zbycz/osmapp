import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { ClimbingView } from './ClimbingView';
import { useClimbingContext } from './contexts/ClimbingContext';
import { PanelScrollbars, PanelWrapper } from '../../utils/PanelHelpers';

const EditRoutesContainer = styled.div`
  padding: 10px;
  overflow: auto;
`;
const Title = styled.div`
  flex: 1;
`;

export const ClimbingPanel = () => {
  const contentRef = useRef(null);
  const [isFullscreenDialogOpened, setIsFullscreenDialogOpened] =
    useState<boolean>(true);

  const {
    setScrollOffset,
    isPointMoving,
    areRoutesVisible,
    setAreRoutesVisible,
  } = useClimbingContext();

  const onFullscreenDialogOpen = () => setIsFullscreenDialogOpened(true);
  const onFullscreenDialogClose = () => setIsFullscreenDialogOpened(false);
  const onScroll = (e) => {
    setScrollOffset({ x: e.target.scrollLeft, y: e.target.scrollTop });
  };

  const VisibilityIconElement = areRoutesVisible
    ? VisibilityOffIcon
    : VisibilityIcon;
  return (
    <>
      {isFullscreenDialogOpened ? (
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
            style={{
              overscrollBehavior: isPointMoving ? 'none' : undefined,
              padding: 0,
            }}
            ref={contentRef}
            onScroll={onScroll}
          >
            <ClimbingView isReadOnly={false} />
          </DialogContent>
        </Dialog>
      ) : (
        <PanelWrapper>
          <PanelScrollbars>
            <ClimbingView isReadOnly onEditorClick={onFullscreenDialogOpen} />
            <EditRoutesContainer>
              <Button
                onClick={onFullscreenDialogOpen}
                color="primary"
                size="small"
                startIcon={<EditIcon />}
                variant="contained"
              >
                Edit routes
              </Button>
            </EditRoutesContainer>
          </PanelScrollbars>
        </PanelWrapper>
      )}
    </>
  );
};
