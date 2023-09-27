import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Dialog } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { ClimbingView } from './ClimbingView';
import { ClimbingContextProvider } from './contexts/climbingContext';
import { ClimbingRoute, EditorPosition } from './types';
import { PanelScrollbars, PanelWrapper } from '../../utils/PanelHelpers';

const EditRoutesContainer = styled.div`
  padding: 10px;
`;

export const ClimbingPanel = () => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isSelectedRouteEditable, setIsSelectedRouteEditable] = useState(false);
  const [routes, setRoutes] = useState<Array<ClimbingRoute>>([]);
  const [editorPosition, setEditorPosition] = useState<EditorPosition>({
    top: 0,
    left: 0,
  });
  const [routeSelectedIndex, setRouteSelectedIndex] = useState<number>(null);
  const [pointSelectedIndex, setPointSelectedIndex] = useState<number>(null);
  const [isFullscreenDialogOpened, setIsFullscreenDialogOpened] =
    useState<boolean>(true);

  const onFullscreenDialogOpen = () => setIsFullscreenDialogOpened(true);
  const onFullscreenDialogClose = () => setIsFullscreenDialogOpened(false);

  const updateRouteOnIndex = (
    routeIndex: number,
    callback?: (route: ClimbingRoute) => ClimbingRoute,
  ) => {
    const updatedRoute = callback ? callback(routes[routeIndex]) : null;
    setRoutes([
      ...routes.slice(0, routeIndex),
      ...(updatedRoute ? [updatedRoute] : []),
      ...routes.slice(routeIndex + 1),
    ]);
  };

  return (
    <ClimbingContextProvider
      value={{
        imageSize,
        setImageSize,
        isSelectedRouteEditable,
        setIsSelectedRouteEditable,
        routes,
        setRoutes,
        editorPosition,
        setEditorPosition,
        routeSelectedIndex,
        setRouteSelectedIndex,
        pointSelectedIndex,
        setPointSelectedIndex,
        updateRouteOnIndex,
      }}
    >
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
