import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// import ZoomInIcon from '@material-ui/icons/ZoomIn';
// import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import SplitPane from 'react-split-pane';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { Fab, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { RouteEditor } from './Editor/RouteEditor';
import { useClimbingContext } from './contexts/ClimbingContext';
import { ControlPanel } from './Editor/ControlPanel';
import { RouteList } from './RouteList';
import { Guide } from './Guide';
import { PositionPx } from './types';
import { updateElementOnIndex } from './utils';

type Props = {
  onEditorClick?: () => void;
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const AddButton = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
`;
const ArrowExpanderButton = styled.div<{ arrowOnTop?: boolean }>`
  position: absolute;
  z-index: 10000;
  background: ${({ theme }) => theme.palette.background.default};
  left: 50%;
  width: 30px;
  border-radius: 0 0 50% 50%;
  ${({ arrowOnTop }) =>
    arrowOnTop
      ? undefined
      : `
  bottom: 0;
  border-radius: 50% 50% 0 0 ;
  `};
  justify-content: center;
  display: flex;
  /* border: solid 1px red; */
`;
const EditorContainer = styled.div<{ imageHeight: number }>`
  display: flex;
  justify-content: center;
  height: ${({ imageHeight }) => `${imageHeight}px`};
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
`;
const BlurContainer = styled.div`
  backdrop-filter: blur(15px);
  background-color: rgba(0, 0, 0, 0.6);

  height: 100%;
`;

const BackgroundContainer = styled.div<{
  imageHeight: number;
  imageUrl: string;
}>`
  background: #111 url(${({ imageUrl }) => imageUrl}) no-repeat;
  background-size: 100% auto;
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
`;

const ImageContainer = styled.div`
  user-select: none;
  position: absolute;
  top: 0;
  height: 100%;
  box-shadow: 0 -0 110px rgba(0, 0, 0, 0.1);
`;

const ImageElement = styled.img<{ zoom?: number }>`
  /* max-width: 100%; */
  /* max-height: 80vh; */
  /* object-fit: contain; */
  // transform: <scale(${({ zoom }) => zoom});
  transition: all 0.1s ease-in;
  height: 100%;
`;

const DialogIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

export const ClimbingView = ({ onEditorClick }: Props) => {
  // https://js-image-viewer-article-ydp7qa.stackblitz.io
  // const [zoom, setZoom] = useState<number>(1);

  const {
    setImageSize,
    imageSize,
    // selectedRouteState,
    // setRouteSelectedIndex,
    routes,
    routeSelectedIndex,
    updateRouteOnIndex,
    setEditorPosition,
    getPercentagePosition,
    getMachine,
    isPointClicked,
    setIsPointMoving,
    pointSelectedIndex,
    findCloserPoint,
    splitPaneHeight,
    setSplitPaneHeight,
    areRoutesVisible,
    setMousePosition,
    countPositionWith,
    isEditMode,
    viewportSize,
    setViewportSize,
    editorPosition,
  } = useClimbingContext();
  const [isSplitViewDragging, setIsSplitViewDragging] = useState(false);
  const imageUrl = '/images/rock.png';
  // const imageUrl = '/images/rock2.jpg';
  // const imageUrl = 'https://www.skalnioblasti.cz/image.php?typ=skala&id=13516';
  // const imageUrl =
  //   'https://image.thecrag.com/2063x960/5b/ea/5bea45dd2e45a4d8e2469223dde84bacf70478b5';
  const imageRef = useRef(null);
  const machine = getMachine();

  const handleImageLoad = () => {
    // const { clientHeight, clientWidth, left, top } = imageRef.current;
    // console.log('____SET', imageRef.current.top, imageRef.current.left);
    // setImageSize({ width: clientWidth, height: clientHeight });
    // setEditorPosition({ x:left, y:top });

    // const rect = e.target.getBoundingClientRect();
    // getWindowDimensions;
    const { clientHeight, clientWidth } = imageRef.current;
    const { left, top } = imageRef.current.getBoundingClientRect();
    setImageSize({ width: clientWidth, height: clientHeight });
    setEditorPosition({ x: left, y: top, units: 'px' });
    setViewportSize({ width: window?.innerWidth, height: window?.innerHeight });
  };

  const onCreateClimbingRouteClick = () => {
    machine.execute('createRoute');
  };

  // const onDeleteWholeRouteClick = (deletedExistingRouteIndex: number) => {
  //   // @TODO co to je?
  //   machine.execute('deleteRoute');
  //   setRouteSelectedIndex(null);
  //   updateRouteOnIndex(deletedExistingRouteIndex);
  // };

  const onEditClimbingRouteClick = () => {
    machine.execute('editRoute'); // možná tímhle nahradit isEditMode
  };

  // const onDeleteExistingClimbingRouteClick = () => {
  //   // @TODO co to je?
  //   machine.execute('deleteRoute');
  // };

  useEffect(() => {
    // @TODO tady někde počítat šířku obrázku a nastavit podle toho výšku
    // setSplitPaneHeight();
    handleImageLoad();
  }, [splitPaneHeight]);

  const onCanvasClick = (e) => {
    if (machine.currentStateName === 'extendRoute') {
      console.log('____', routes);
      machine.execute('addPointToEnd', {
        position: { x: e.clientX, y: e.clientY },
      });
      console.log('____2', routes);
      return;
    }

    machine.execute('cancelRouteSelection');
  };

  const onMove = (position: PositionPx) => {
    if (isPointClicked) {
      setMousePosition(null);
      machine.execute('dragPoint', { position });

      setIsPointMoving(true);
      const newCoordinate = getPercentagePosition(
        countPositionWith(['editorPosition'], position),
      );

      const closestPoint = findCloserPoint(newCoordinate);

      const updatedPoint = closestPoint ?? newCoordinate;
      updateRouteOnIndex(routeSelectedIndex, (route) => ({
        ...route,
        path: updateElementOnIndex(route.path, pointSelectedIndex, (point) => ({
          // @TODO route.path can be undefined, why?
          ...point,
          x: updatedPoint.x,
          y: updatedPoint.y,
        })),
      }));
    } else if (machine.currentStateName !== 'extendRoute') {
      setMousePosition(null);
    } else {
      setMousePosition(position);
    }
  };

  const onTouchMove = (e) => {
    onMove({ x: e.touches[0].clientX, y: e.touches[0].clientY, units: 'px' });
  };

  const onMouseMove = (e) => {
    onMove(
      countPositionWith(['scrollOffset'], {
        x: e.clientX,
        y: e.clientY,
        units: 'px',
      }),
    );
  };

  const onUndoClick = () => {
    machine.execute('undoPoint');
  };
  const onSplitPaneHeightReset = () => {
    setSplitPaneHeight(300);
  };

  const onNewRouteCreate = () => {
    machine.execute('createRoute');
    // const newIndex = routes.length;
    // setRoutes([...routes, emptyRoute]);
    // setRouteSelectedIndex(newIndex);
  };

  React.useEffect(() => {
    window.addEventListener('resize', handleImageLoad);
    window.addEventListener('orientationchange', handleImageLoad);

    // @TODO tady někde počítat šířku obrázku a nastavit podle toho výšku
    // setSplitPaneHeight();

    return () => {
      window.removeEventListener('resize', handleImageLoad);
      window.removeEventListener('orientationchange', handleImageLoad);
    };
  }, []);

  const onDragStarted = () => {
    setIsSplitViewDragging(true);
  };
  const onDragFinished = (splitHeight) => {
    setIsSplitViewDragging(false);
    setSplitPaneHeight(splitHeight);
  };

  // @TODO udělat header footer jako edit dialog
  const showArrowOnTop = splitPaneHeight === 0;
  const showArrowOnBottom =
    splitPaneHeight === viewportSize.height - editorPosition.y;
  return (
    <Container>
      {(showArrowOnTop || showArrowOnBottom) && (
        <ArrowExpanderButton arrowOnTop={showArrowOnTop}>
          <IconButton
            onClick={onSplitPaneHeightReset}
            color="primary"
            size="small"
          >
            {showArrowOnTop ? (
              <ArrowDownwardIcon fontSize="small" />
            ) : (
              <ArrowUpwardIcon fontSize="small" />
            )}
          </IconButton>
        </ArrowExpanderButton>
      )}
      <SplitPane
        split="horizontal"
        minSize={0}
        maxSize="100%"
        size={splitPaneHeight}
        onDragStarted={onDragStarted}
        onDragFinished={onDragFinished}
        pane1Style={{ maxHeight: '100%' }}
      >
        <BackgroundContainer imageHeight={imageSize.height} imageUrl={imageUrl}>
          <BlurContainer>
            {isEditMode && areRoutesVisible && (
              <ControlPanel
                onEditClimbingRouteClick={onEditClimbingRouteClick}
                onCreateClimbingRouteClick={onCreateClimbingRouteClick}
                onUndoClick={onUndoClick}
              />
            )}
            <EditorContainer imageHeight={imageSize.height}>
              <ImageContainer>
                <ImageElement
                  src={imageUrl}
                  onLoad={handleImageLoad}
                  ref={imageRef}
                  // zoom={zoom}
                />
              </ImageContainer>
              {!isSplitViewDragging && areRoutesVisible && (
                <>
                  <RouteEditor
                    routes={routes}
                    onClick={onEditorClick || onCanvasClick}
                    onEditorMouseMove={onMouseMove}
                    onEditorTouchMove={onTouchMove}
                  />
                  <Guide />
                </>
              )}
            </EditorContainer>
          </BlurContainer>
        </BackgroundContainer>

        <RouteList
        // onDeleteExistingRouteClick={onDeleteWholeRouteClick}
        />
      </SplitPane>
      <AddButton>
        <Fab color="primary" variant="extended" onClick={onNewRouteCreate}>
          <AddIcon />
          New route
        </Fab>
      </AddButton>
      <DialogIcon>
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
