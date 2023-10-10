import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Dialog, DialogContent } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { ClimbingView } from './ClimbingView';
import { useClimbingContext } from './contexts/ClimbingContext';
import { PanelScrollbars, PanelWrapper } from '../../utils/PanelHelpers';

const EditRoutesContainer = styled.div`
  padding: 10px;
`;

export const ClimbingPanel = () => {
  const contentRef = useRef(null);
  const [isFullscreenDialogOpened, setIsFullscreenDialogOpened] =
    useState<boolean>(true);

  const { setScrollOffset } = useClimbingContext();

  const onFullscreenDialogOpen = () => setIsFullscreenDialogOpened(true);
  const onFullscreenDialogClose = () => setIsFullscreenDialogOpened(false);
  const onScroll = (e) => {
    setScrollOffset({ x: e.target.scrollLeft, y: e.target.scrollTop });
  };

  return (
    <>
      {isFullscreenDialogOpened ? (
        <Dialog
          fullScreen
          open={isFullscreenDialogOpened}
          onClose={onFullscreenDialogClose}
        >
          <DialogContent
            style={{ overscrollBehavior: 'none', padding: 0 }}
            ref={contentRef}
            onScroll={onScroll}
          >
            <ClimbingView
              isFullscreenDialogOpened={isFullscreenDialogOpened}
              setIsFullscreenDialogOpened={setIsFullscreenDialogOpened}
              isReadOnly={false}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <PanelWrapper>
          <PanelScrollbars>
            <ClimbingView
              isFullscreenDialogOpened={isFullscreenDialogOpened}
              setIsFullscreenDialogOpened={setIsFullscreenDialogOpened}
              isReadOnly
              onEditorClick={onFullscreenDialogOpen}
            />
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
