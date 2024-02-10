import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import ZoomInIcon from '@material-ui/icons/ZoomIn';
// import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import SplitPane from 'react-split-pane';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { CircularProgress, IconButton } from '@material-ui/core';

import {
  TransformComponent,
  TransformWrapper,
  // MiniMap,
} from 'react-zoom-pan-pinch';
import { useClimbingContext } from './contexts/ClimbingContext';
import { RouteList } from './RouteList/RouteList';

import { RoutesEditor } from './Editor/RoutesEditor';
import { getWikiImage2 } from '../../../services/images/getWikiImage';
import { Guide } from './Guide';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const LoadingContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100px;
  align-items: center;
`;

const ArrowExpanderContainer = styled.div`
  position: absolute;
  z-index: 1000000;
  width: 100%;
  top: -6px;
`;

const ArrowExpanderButton = styled.div<{ arrowOnTop?: boolean }>`
  background: ${({ theme }) => theme.palette.background.default};
  /* left: 50%; */
  width: 30px;
  height: 30px;
  margin: auto;
  border-radius: 50%;
  ${({ arrowOnTop }) =>
    arrowOnTop
      ? undefined
      : `
  bottom: 0;
  border-radius: 50%;
  `};
  justify-content: center;
  display: flex;
  /* border: solid 1px red; */
`;

const BlurContainer = styled.div<{ isVisible: boolean }>`
  backdrop-filter: blur(15px);
  background-color: rgba(0, 0, 0, 0.6);
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  height: 100%;
`;

const BackgroundContainer = styled.div<{
  imageHeight: number;
  imageUrl: string;
  isVisible: boolean;
}>`
  transition: 0.3s all;

  background: #111
    ${({ isVisible, imageUrl }) =>
      isVisible ? `url(${imageUrl}) no-repeat` : ''};
  background-size: cover;
  background-position: center;
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
`;

// const DialogIcon = styled.div`
//   position: absolute;
//   top: 10px;
//   right: 10px;
// `;
export const ClimbingView = () => {
  // https://js-image-viewer-article-ydp7qa.stackblitz.io
  // const [zoom, setZoom] = useState<number>(1);

  const {
    imageSize,
    routeSelectedIndex,
    getMachine,
    splitPaneHeight,
    setSplitPaneHeight,
    areRoutesVisible,
    isEditMode,
    viewportSize,
    editorPosition,
    photoPath,
    handleImageLoad,
    areRoutesLoading,
    setArePointerEventsDisabled,
    setImageZoom, // TODO remove it from context
    photoPaths,
    getAllRoutesPhotos,
    setPhotoPath,
  } = useClimbingContext();

  const [isSplitViewDragging, setIsSplitViewDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const machine = getMachine();

  useEffect(() => {
    if (isEditMode && machine.currentStateName === 'routeSelected') {
      machine.execute('editRoute', { routeNumber: routeSelectedIndex }); // možná tímhle nahradit isEditMode
    }

    if (!isEditMode && machine.currentStateName === 'editRoute') {
      machine.execute('routeSelect', { routeNumber: routeSelectedIndex });
    }
  }, [isEditMode]);

  useEffect(() => {
    handleImageLoad();
    // setAreRoutesLoading(true);
  }, [splitPaneHeight]);

  useEffect(() => {
    handleImageLoad();
  }, []);

  const onSplitPaneHeightReset = () => {
    setSplitPaneHeight(null);
  };

  React.useEffect(() => {
    window.addEventListener('resize', () => handleImageLoad());
    window.addEventListener('orientationchange', () => handleImageLoad());

    return () => {
      window.removeEventListener('resize', () => handleImageLoad());
      window.removeEventListener('orientationchange', () => handleImageLoad());
    };
  }, []);

  const onDragStarted = () => {
    setIsSplitViewDragging(true);
  };
  const onDragFinished = (splitHeight) => {
    setSplitPaneHeight(splitHeight);
    setIsSplitViewDragging(false);
  };
  const [isPhotoLoaded, setIsPhotoLoaded] = useState(false);

  // @TODO unify XYZ1
  if (photoPaths === null) getAllRoutesPhotos();
  if (!photoPath && photoPaths?.length > 0) setPhotoPath(photoPaths[0]);

  useEffect(() => {
    setIsPhotoLoaded(false);
    const image = getWikiImage2(photoPath);
    setImageUrl(image);
  }, [photoPath]);

  // @TODO udělat header footer jako edit dialog
  const showArrowOnTop = splitPaneHeight === 0;
  const showArrowOnBottom =
    splitPaneHeight === viewportSize.height - editorPosition.y;

  // const stopPointerEvents2 = () => {
  //   setArePointerEventsDisabled(false);
  //   setTimeout(() => {
  //     setArePointerEventsDisabled(true);
  //   }, 1000);
  // };
  const startPointerEvents = () => {
    setArePointerEventsDisabled(false);
  };
  const stopPointerEvents = () => {
    setArePointerEventsDisabled(true);
  };

  return (
    <Container>
      {(showArrowOnTop || showArrowOnBottom) && (
        <ArrowExpanderContainer>
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
        </ArrowExpanderContainer>
      )}
      <SplitPane
        split="horizontal"
        minSize={0}
        maxSize="100%"
        size={splitPaneHeight ?? '60vh'}
        onDragStarted={onDragStarted}
        onDragFinished={onDragFinished}
        pane1Style={{ maxHeight: '90%' }}
      >
        <BackgroundContainer
          imageHeight={imageSize.height}
          imageUrl={imageUrl}
          isVisible={isPhotoLoaded}
        >
          {!isPhotoLoaded && (
            <LoadingContainer>
              <CircularProgress color="primary" />
            </LoadingContainer>
          )}
          <BlurContainer isVisible={isPhotoLoaded}>
            <TransformWrapper
              onWheelStart={stopPointerEvents}
              onWheelStop={startPointerEvents}
              onPinchingStart={stopPointerEvents}
              onPinchingStop={startPointerEvents}
              onZoomStart={stopPointerEvents}
              onZoomStop={startPointerEvents}
              onPanningStart={startPointerEvents}
              onPanningStop={startPointerEvents}
              wheel={{ step: 100 }}
              onTransformed={(
                _ref,
                state: { scale: number; positionX: number; positionY: number },
              ) => {
                setImageZoom(state);
                // console.log('____state', _ref, state);
              }}
            >
              {/* {isPhotoLoaded && (
          <MiniMap width={200}>
            <RoutesEditor
              isRoutesLayerVisible={false}
              setIsPhotoLoaded={setIsPhotoLoaded}
            />
          </MiniMap>
        )} */}
              <TransformComponent
                wrapperStyle={{ height: '100%', width: '100%' }}
                contentStyle={{ height: '100%', width: '100%' }}
              >
                <>
                  <RoutesEditor
                    isRoutesLayerVisible={
                      !isSplitViewDragging &&
                      areRoutesVisible &&
                      !areRoutesLoading
                    }
                    imageUrl={imageUrl}
                    setIsPhotoLoaded={setIsPhotoLoaded}
                  />
                </>
              </TransformComponent>
            </TransformWrapper>
            {isEditMode && areRoutesVisible && <Guide />}
          </BlurContainer>
        </BackgroundContainer>

        <RouteList isEditable />
      </SplitPane>

      {/* <DialogIcon>
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
      </DialogIcon> */}
    </Container>
  );
};
