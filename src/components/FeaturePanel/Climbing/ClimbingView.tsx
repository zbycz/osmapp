import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import ZoomInIcon from '@material-ui/icons/ZoomIn';
// import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import SplitPane from 'react-split-pane';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { CircularProgress, IconButton } from '@material-ui/core';

import { useClimbingContext } from './contexts/ClimbingContext';
import { RouteList } from './RouteList/RouteList';

import { RoutesEditor } from './Editor/RoutesEditor';

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
  background-size: 100% auto;
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
`;

const DialogIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;
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
    setAreRoutesVisible,
  } = useClimbingContext();

  const [isSplitViewDragging, setIsSplitViewDragging] = useState(false);

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
    // @TODO tady někde počítat šířku obrázku a nastavit podle toho výšku
    // setSplitPaneHeight();
    setAreRoutesVisible(false);
    handleImageLoad();
  }, [splitPaneHeight]);

  useEffect(() => {
    console.log('________LOAD');
    // if (!splitPaneHeight) setSplitPaneHeight(600);
    handleImageLoad();
  }, []);

  const onSplitPaneHeightReset = () => {
    setSplitPaneHeight(300);
  };

  React.useEffect(() => {
    window.addEventListener('resize', () => handleImageLoad());
    window.addEventListener('orientationchange', () => handleImageLoad());

    // @TODO tady někde počítat šířku obrázku a nastavit podle toho výšku
    // setSplitPaneHeight();

    return () => {
      window.removeEventListener('resize', () => handleImageLoad());
      window.removeEventListener('orientationchange', () => handleImageLoad());
    };
  }, []);

  const onDragStarted = () => {
    setIsSplitViewDragging(true);
  };
  const onDragFinished = (splitHeight) => {
    setIsSplitViewDragging(false);
    setSplitPaneHeight(splitHeight);
  };
  const [isPhotoLoaded, setIsPhotoLoaded] = useState(false);

  useEffect(() => {
    setIsPhotoLoaded(false);
  }, [photoPath]);

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
        size={splitPaneHeight || '60vh'}
        onDragStarted={onDragStarted}
        onDragFinished={onDragFinished}
        pane1Style={{ maxHeight: '100%' }}
      >
        <BackgroundContainer
          imageHeight={imageSize.height}
          imageUrl={photoPath}
          isVisible={isPhotoLoaded}
        >
          {!isPhotoLoaded && (
            <LoadingContainer>
              <CircularProgress />
            </LoadingContainer>
          )}
          <BlurContainer isVisible={isPhotoLoaded}>
            <RoutesEditor
              isRoutesLayerVisible={!isSplitViewDragging && areRoutesVisible}
              setIsPhotoLoaded={setIsPhotoLoaded}
            />
          </BlurContainer>
        </BackgroundContainer>
        <RouteList isEditable />
      </SplitPane>

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
