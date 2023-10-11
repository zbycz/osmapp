import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
// import ZoomInIcon from '@material-ui/icons/ZoomIn';
// import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { RouteEditor } from './Editor/RouteEditor';
import { useClimbingContext } from './contexts/ClimbingContext';
import { ControlPanel } from './Editor/ControlPanel';
import { RouteList } from './RouteList';
import { Guide } from './Guide';
import { Position } from './types';
import { updateElementOnIndex } from './utils';

type Props = {
  setIsFullscreenDialogOpened: (isFullscreenDialogOpened: boolean) => void;
  isFullscreenDialogOpened: boolean;
  isReadOnly: boolean;
  onEditorClick?: () => void;
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const StickyContainer = styled.div<{ imageHeight: number }>`
  position: relative;
  height: ${({ imageHeight }) => `${imageHeight}px`};
`;

const ImageContainer = styled.div`
  user-select: none;
  position: absolute;
  top: 0;
`;

const ImageElement = styled.img<{ zoom?: number }>`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  // transform: <scale(${({ zoom }) => zoom});
  transition: all 0.1s ease-in;
`;

const DialogIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

export const ClimbingView = ({
  setIsFullscreenDialogOpened,
  isFullscreenDialogOpened,
  isReadOnly,
  onEditorClick,
}: Props) => {
  // https://js-image-viewer-article-ydp7qa.stackblitz.io
  // const [zoom, setZoom] = useState<number>(1);

  const {
    setImageSize,
    imageSize,
    isSelectedRouteEditable,
    setIsSelectedRouteEditable,
    setRouteSelectedIndex,
    routes,
    routeSelectedIndex,
    updateRouteOnIndex,
    setEditorPosition,
    editorPosition,
    getPercentagePosition,
    useMachine,
    isPointClicked,
    setIsPointMoving,
    pointSelectedIndex,
    scrollOffset,
  } = useClimbingContext();

  // const imageUrl = '/images/rock.png';
  const imageUrl = '/images/rock2.jpg';
  // const imageUrl = "https://upload.zby.cz/screenshot-2023-09-12-at-17.12.24.png"
  // const imageUrl = "https://www.skalnioblasti.cz/image.php?typ=skala&id=13516"
  // const imageUrl =
  // 'https://image.thecrag.com/2063x960/5b/ea/5bea45dd2e45a4d8e2469223dde84bacf70478b5';
  const imageRef = useRef(null);
  const machine = useMachine();

  const handleImageLoad = () => {
    // const { clientHeight, clientWidth, left, top } = imageRef.current;
    // console.log('____SET', imageRef.current.top, imageRef.current.left);
    // setImageSize({ width: clientWidth, height: clientHeight });
    // setEditorPosition({ x:left, y:top });

    // const rect = e.target.getBoundingClientRect();
    const { clientHeight, clientWidth } = imageRef.current;
    const { left, top } = imageRef.current.getBoundingClientRect();
    setImageSize({ width: clientWidth, height: clientHeight });
    setEditorPosition({ x: left, y: top });
  };

  const onCreateClimbingRouteClick = () => {
    machine.execute('createRoute');
  };

  const onCreateSchemaForExistingRouteClick = (
    updatedRouteSelectedIndex: number,
  ) => {
    machine.execute('updateRoute', { updatedRouteSelectedIndex });
  };

  const onDeleteWholeRouteClick = (deletedExistingRouteIndex: number) => {
    // @TODO co to je?
    machine.execute('deleteRoute');
    setIsSelectedRouteEditable(false);
    setRouteSelectedIndex(null);
    updateRouteOnIndex(deletedExistingRouteIndex);
  };

  const onEditClimbingRouteClick = () => {
    machine.execute('editRoute');
  };

  const onDeleteExistingClimbingRouteClick = () => {
    // @TODO co to je?
    machine.execute('deleteRoute');
  };

  useEffect(() => {
    handleImageLoad();
  }, []);

  const onCanvasClick = (e) => {
    machine.execute('addPoint');
    if (isSelectedRouteEditable) {
      const newCoordinate = getPercentagePosition({
        x: scrollOffset.x + e.clientX - editorPosition.x,
        y: scrollOffset.y + e.clientY - editorPosition.y,
      });

      updateRouteOnIndex(routeSelectedIndex, (route) => ({
        ...route,
        path: [...route.path, newCoordinate],
      }));

      return;
    }

    machine.execute('cancelRouteSelection');
  };

  const onMove = (position: Position) => {
    if (isPointClicked) {
      machine.execute('dragPoint', { position });

      setIsPointMoving(true);
      const newCoordinate = getPercentagePosition({
        x: position.x - editorPosition.x,
        y: position.y - editorPosition.y,
      });
      updateRouteOnIndex(routeSelectedIndex, (route) => ({
        ...route,
        path: updateElementOnIndex(route.path, pointSelectedIndex, (point) => ({
          ...point,
          x: newCoordinate.x,
          y: newCoordinate.y,
        })),
      }));
    }
  };

  const onTouchMove = (e) => {
    onMove({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const onMouseMove = (e) => {
    const hoveredPosition = {
      x: scrollOffset.x + e.clientX,
      y: scrollOffset.y + e.clientY,
    };

    onMove(hoveredPosition);
  };

  const onUndoClick = () => {
    machine.execute('undoPoint');
  };

  React.useEffect(() => {
    window.addEventListener('resize', handleImageLoad);
    window.addEventListener('orientationchange', handleImageLoad);

    return () => {
      window.removeEventListener('resize', handleImageLoad);
      window.removeEventListener('orientationchange', handleImageLoad);
    };
  }, []);

  // @TODO udělat header footer jako edit dialog
  return (
    <Container>
      <StickyContainer imageHeight={imageSize.height}>
        {!isReadOnly && (
          <ControlPanel
            onEditClimbingRouteClick={onEditClimbingRouteClick}
            onDeleteExistingClimbingRouteClick={
              onDeleteExistingClimbingRouteClick
            }
            onCreateClimbingRouteClick={onCreateClimbingRouteClick}
            onUndoClick={onUndoClick}
          />
        )}
        <ImageContainer>
          <ImageElement
            src={imageUrl}
            onLoad={handleImageLoad}
            ref={imageRef}
            // zoom={zoom}
          />
        </ImageContainer>
        <RouteEditor
          routes={routes}
          onClick={onEditorClick || onCanvasClick}
          onEditorMouseMove={onMouseMove}
          onEditorTouchMove={onTouchMove}
        />
      </StickyContainer>

      <Guide />

      <RouteList
        isReadOnly={isReadOnly}
        onCreateSchemaForExistingRouteClick={
          onCreateSchemaForExistingRouteClick
        }
        onDeleteExistingRouteClick={onDeleteWholeRouteClick}
      />
      <DialogIcon>
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
        {/* <IconButton
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
        </IconButton> */}
      </DialogIcon>
    </Container>
  );
};
