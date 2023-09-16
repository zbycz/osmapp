import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
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

const ImageContainer = styled.div``;

const ImageElement = styled.img<{ zoom: number }>`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  // transform: scale(${({ zoom }) => zoom});
  transition: all 0.1s ease-in;
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
  const [tempRoute, setTempRoute] = useState<ClimbingRoute>(null);
  const [zoom, setZoom] = useState<number>(1);

  const {
    setImageSize,
    imageSize,
    isSelectedRouteEditable,
    setIsSelectedRouteEditable,
    setRouteSelectedIndex,
    routes,
    setRoutes,
    routeSelectedIndex,
  } = useContext(ClimbingEditorContext);

  const imageUrl = '/images/rock.png';
  // const imageUrl = "https://upload.zby.cz/screenshot-2023-09-12-at-17.12.24.png"
  // const imageUrl = "https://www.skalnioblasti.cz/image.php?typ=skala&id=13516"
  const imageRef = useRef(null);

  const handleImageLoad = () => {
    const { clientHeight, clientWidth } = imageRef.current;
    setImageSize({ width: clientWidth, height: clientHeight });
  };

  const onCreateClimbingRouteClick = () => {
    setIsSelectedRouteEditable(true);
    setTempRoute(emptyRoute);
    setRouteSelectedIndex(routes.length);
  };
  const onUpdateExistingRouteClick = (updatedRouteSelectedIndex: number) => {
    setIsSelectedRouteEditable(true);
    setTempRoute({ ...routes[updatedRouteSelectedIndex], path: [] });
    setRouteSelectedIndex(updatedRouteSelectedIndex);
  };

  const onFinishClimbingRouteClick = () => {
    setIsSelectedRouteEditable(false);
    setRoutes([
      ...routes.slice(0, routeSelectedIndex),
      tempRoute,
      ...routes.slice(routeSelectedIndex + 1),
    ]);
    setTempRoute(null);
    setRouteSelectedIndex(null);
  };
  const onCancelClimbingRouteClick = () => {
    setIsSelectedRouteEditable(false);
    setTempRoute(null);
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

    if (isSelectedRouteEditable) {
      const rect = e.target.getBoundingClientRect();

      const newCoordinate = {
        x: (e.clientX - rect.left) / imageSize.width,
        y: (e.clientY - rect.top) / imageSize.height,
      };
      setTempRoute({ ...tempRoute, path: [...tempRoute.path, newCoordinate] });
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

  React.useEffect(() => {
    window.addEventListener('resize', handleImageLoad);

    return () => {
      window.removeEventListener('resize', handleImageLoad);
    };
  }, []);

  return (
    <Container>
      <ImageContainer>
        <ImageElement
          src={imageUrl}
          onLoad={handleImageLoad}
          ref={imageRef}
          zoom={zoom}
        />
      </ImageContainer>
      <RouteEditor
        routes={
          tempRoute
            ? [
                ...routes.slice(0, routeSelectedIndex),
                tempRoute,
                ...routes.slice(routeSelectedIndex + 1),
              ]
            : routes
        }
        onClick={onCanvasClick}
        onRouteSelect={onRouteSelect}
      />

      <ControlPanel
        onFinishClimbingRouteClick={onFinishClimbingRouteClick}
        tempRoute={tempRoute}
        onCancelClimbingRouteClick={onCancelClimbingRouteClick}
        onCreateClimbingRouteClick={onCreateClimbingRouteClick}
        onDeleteExistingClimbingRouteClick={onDeleteExistingClimbingRouteClick}
      />

      <RouteList onUpdateExistingRouteClick={onUpdateExistingRouteClick} />
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

        <IconButton
          color="secondary"
          edge="end"
          onClick={() => {
            setZoom(zoom + 0.2);
          }}
        >
          <ZoomInIcon fontSize="small" />
        </IconButton>
        <IconButton
          color="secondary"
          edge="end"
          onClick={() => {
            setZoom(zoom - 0.2);
          }}
        >
          <ZoomOutIcon fontSize="small" />
        </IconButton>
      </DialogIcon>
    </Container>
  );
};
