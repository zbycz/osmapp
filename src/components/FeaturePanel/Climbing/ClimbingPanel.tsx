import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { RouteEditor } from './RouteEditor';
import type { ClimbingRoute } from './types';
import { ClimbingEditorContext } from './contexts/climbingEditorContext';
import { ControlPanel } from './ControlPanel';
import { RouteList } from './RouteList';
import { emptyRoute } from './utils/emptyRoute';

const Container = styled.div`
  position: relative;
`;

const ImageElement = styled.img`
  width: 100%;
`;
const DialogIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

export const ClimbingPanel = ({
  setIsFullscreenDialogOpened,
  isFullscreenDialogOpened,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [newRoute, setNewRoute] = useState<ClimbingRoute>(null);
  const [routes, setRoutes] = useState<Array<ClimbingRoute>>([]);
  const [routeSelectedIndex, setRouteSelectedIndex] = useState<number>(null);

  const { setImageSize, imageSize } = useContext(ClimbingEditorContext);

  const imageUrl = '/images/rock.png';
  // const imageUrl = "https://upload.zby.cz/screenshot-2023-09-12-at-17.12.24.png"
  // const imageUrl = "https://www.skalnioblasti.cz/image.php?typ=skala&id=13516"

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setImageSize({ width: image.width, height: image.height });
    };
    image.src = imageUrl;
  }, []);

  const onCreateClimbingRouteClick = () => {
    setIsEditable(true);
    setNewRoute(emptyRoute);
    setRouteSelectedIndex(routes.length);
  };
  const onUpdateExistingRouteClick = (updatedRouteSelectedIndex: number) => {
    setIsEditable(true);
    setNewRoute({ ...routes[updatedRouteSelectedIndex], path: [] });
    setRouteSelectedIndex(updatedRouteSelectedIndex);
  };

  const onFinishClimbingRouteClick = () => {
    setIsEditable(false);
    setRoutes([
      ...routes.slice(0, routeSelectedIndex),
      newRoute,
      ...routes.slice(routeSelectedIndex + 1),
    ]);
    setNewRoute(null);
    setRouteSelectedIndex(null);
  };
  const onCancelClimbingRouteClick = () => {
    setIsEditable(false);
    setNewRoute(null);
    setRouteSelectedIndex(null);
  };
  const onDeleteExistingClimbingRouteClick = () => {
    setRoutes([
      ...routes.slice(0, routeSelectedIndex),
      { ...routes[routeSelectedIndex], path: [] },
      ...routes.slice(routeSelectedIndex + 1),
    ]);
    setRouteSelectedIndex(null);
  };

  const onCanvasClick = (e) => {
    const isDoubleClick = e.detail === 2;

    if (isEditable) {
      const rect = e.target.getBoundingClientRect();

      const newCoordinate = {
        x: (e.clientX - rect.left) / imageSize.width,
        y: (e.clientY - rect.top) / imageSize.height,
      };
      setNewRoute({ ...newRoute, path: [...newRoute.path, newCoordinate] });
      if (isDoubleClick) {
        onFinishClimbingRouteClick();
      }
    } else {
      setRouteSelectedIndex(null);
    }
  };

  const onRouteSelect = (routeNumber: number) => {
    setRouteSelectedIndex(routeNumber);
  };

  return (
    <Container>
      <ImageElement src={imageUrl} />
      <RouteEditor
        routes={
          newRoute
            ? [
                ...routes.slice(0, routeSelectedIndex),
                newRoute,
                ...routes.slice(routeSelectedIndex + 1),
              ]
            : routes
        }
        isEditable={isEditable}
        onClick={onCanvasClick}
        routeSelectedIndex={routeSelectedIndex}
        onRouteSelect={onRouteSelect}
      />

      <ControlPanel
        onFinishClimbingRouteClick={onFinishClimbingRouteClick}
        isEditable={isEditable}
        newRoute={newRoute}
        onCancelClimbingRouteClick={onCancelClimbingRouteClick}
        onCreateClimbingRouteClick={onCreateClimbingRouteClick}
        onDeleteExistingClimbingRouteClick={onDeleteExistingClimbingRouteClick}
        routeSelectedIndex={routeSelectedIndex}
      />

      <RouteList
        routes={routes}
        routeSelectedIndex={routeSelectedIndex}
        setRoutes={setRoutes}
        onUpdateExistingRouteClick={onUpdateExistingRouteClick}
        setRouteSelectedIndex={setRouteSelectedIndex}
      />
      <DialogIcon>
        <IconButton
          color="secondary"
          edge="end"
          onClick={() => {
            setIsFullscreenDialogOpened(!isFullscreenDialogOpened);
          }}
        >
          {isFullscreenDialogOpened ? (
            <CloseIcon fontSize="small" />
          ) : (
            <FullscreenIcon fontSize="small" />
          )}
        </IconButton>
      </DialogIcon>
    </Container>
  );
};
