import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Dialog } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { ClimbingView } from './ClimbingView';
import { ClimbingContextProvider } from './contexts/ClimbingContext';
import { PanelScrollbars, PanelWrapper } from '../../utils/PanelHelpers';

const EditRoutesContainer = styled.div`
  padding: 10px;
`;

export const ClimbingPanel = () => {
  const [isFullscreenDialogOpened, setIsFullscreenDialogOpened] =
    useState<boolean>(true);

  const onFullscreenDialogOpen = () => setIsFullscreenDialogOpened(true);
  const onFullscreenDialogClose = () => setIsFullscreenDialogOpened(false);
  return (
    <ClimbingContextProvider>
      {isFullscreenDialogOpened ? (
        <Dialog
          fullScreen
          open={isFullscreenDialogOpened}
          onClose={onFullscreenDialogClose}
        >
          <ClimbingView
            isFullscreenDialogOpened={isFullscreenDialogOpened}
            setIsFullscreenDialogOpened={setIsFullscreenDialogOpened}
            isReadOnly={false}
          />
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
    </ClimbingContextProvider>
  );
};
