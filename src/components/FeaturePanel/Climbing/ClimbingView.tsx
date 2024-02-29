import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SplitPane from 'react-split-pane';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { CircularProgress, IconButton } from '@material-ui/core';

import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useClimbingContext } from './contexts/ClimbingContext';
import { RouteList } from './RouteList/RouteList';
import { RoutesEditor } from './Editor/RoutesEditor';
import { getCommonsImageUrl } from '../../../services/images/getWikiImage';
import { Guide } from './Guide';
import { ControlPanel } from './Editor/ControlPanel';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  .Resizer.horizontal {
    height: 15px;
    margin: -7px 0;
    z-index: 100000;
    cursor: row-resize;
    display: flex;
    justify-content: center;
    &::before {
      position: absolute;
      content: '...';
      border-radius: 6px;
      width: 40px;
      height: 12px;
      background: ${({ theme }) => theme.palette.background.paper};
      margin-top: 1px;
      z-index: 1;
      transition: all 0.1s ease;
      border: solid 1px ${({ theme }) => theme.palette.divider};
      text-align: center;
      line-height: 0px;
      font-size: 20px;
      color: ${({ theme }) => theme.palette.climbing.text};
      letter-spacing: 1px;
    }

    &:hover {
      &::before {
        background-color: ${({ theme }) => theme.palette.climbing.active};
        border: solid 1px ${({ theme }) => theme.palette.climbing.active};
        color: ${({ theme }) => theme.palette.primary.contrastText};
      }
      &::after {
        border-color: ${({ theme }) => theme.palette.climbing.active};
        transition: all 0.5s ease-out;
        border-width: 1px;
        margin-top: 6px;
      }
    }
    &::after {
      position: absolute;
      content: '';

      width: 100%;
      height: 1px;
      margin-top: 7px;
      border-top: solid 1px #222;
      transition: all 0.1s ease;
    }
  }
  .Pane.horizontal.Pane2 {
    margin-top: 0;
    overflow: auto;
  }
  .Pane2 {
    overflow: auto;

    /* TODO cover for light mode wrong Cover color */
    background:
      /* Shadow Cover TOP */ radial-gradient(
          farthest-side at 50% 0,
          ${({ theme }) => theme.palette.background.paper},
          ${({ theme }) => theme.palette.background.paper}
        )
        center top,
      /* Shadow Cover BOTTOM */
        radial-gradient(
          farthest-side at 50% 100%,
          ${({ theme }) => theme.palette.background.paper},
          ${({ theme }) => theme.palette.background.paper}
        )
        center bottom,
      /* Shadow TOP */
        radial-gradient(
          farthest-side at 50% 0,
          ${({ theme }) => theme.palette.grey['600']},
          transparent
        )
        center top,
      /* Shadow BOTTOM */
        radial-gradient(
          farthest-side at 50% 100%,
          ${({ theme }) => theme.palette.grey['600']},
          transparent
        )
        center bottom;
    background-repeat: no-repeat;
    background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
    background-attachment: local, local, scroll, scroll;

    background-color: ${({ theme }) => theme.palette.background.paper};
  }
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
`;

const NoPhoto = styled.div<{ isVisible: boolean }>`
  text-align: center;
  color: ${({ theme }) => theme.palette.text.hint};
  padding: 10px;
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

export const ClimbingView = ({ photoIndex }: { photoIndex?: number }) => {
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
    loadPhotoRelatedData,
    areRoutesLoading,
    setArePointerEventsDisabled,
    setPhotoZoom,
    preparePhotosAndSet,
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
    loadPhotoRelatedData();
  }, [splitPaneHeight]);

  useEffect(() => {
    loadPhotoRelatedData();
  }, []);

  const onSplitPaneHeightReset = () => {
    setSplitPaneHeight(null);
  };

  React.useEffect(() => {
    window.addEventListener('resize', () => loadPhotoRelatedData());
    window.addEventListener('orientationchange', () => loadPhotoRelatedData());

    return () => {
      window.removeEventListener('resize', () => loadPhotoRelatedData());
      window.removeEventListener('orientationchange', () =>
        loadPhotoRelatedData(),
      );
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

  preparePhotosAndSet(photoIndex);

  useEffect(() => {
    setIsPhotoLoaded(false);
    const url = getCommonsImageUrl(`File:${photoPath}`, 1500);
    setImageUrl(url);
  }, [photoPath]);

  const showArrowOnTop = splitPaneHeight === 0;
  const showArrowOnBottom =
    splitPaneHeight === viewportSize.height - editorPosition.y;

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
          {photoPath ? (
            <>
              {!isPhotoLoaded && (
                <LoadingContainer>
                  <CircularProgress color="primary" />
                </LoadingContainer>
              )}
              <BlurContainer isVisible={isPhotoLoaded}>
                <TransformWrapper
                  doubleClick={{
                    disabled: true,
                  }}
                  onWheelStart={stopPointerEvents}
                  onWheelStop={startPointerEvents}
                  onPinchingStart={stopPointerEvents}
                  onPinchingStop={startPointerEvents}
                  onZoomStart={stopPointerEvents}
                  onZoomStop={startPointerEvents}
                  onPanningStart={startPointerEvents}
                  onPanningStop={startPointerEvents}
                  wheel={{ step: 100 }}
                  centerOnInit
                  onTransformed={(
                    _ref,
                    state: {
                      scale: number;
                      positionX: number;
                      positionY: number;
                    },
                  ) => {
                    setPhotoZoom(state);
                  }}
                >
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
                {isEditMode && areRoutesVisible && (
                  <>
                    <ControlPanel />
                    <Guide />
                  </>
                )}
              </BlurContainer>
            </>
          ) : (
            <NoPhoto>No image</NoPhoto>
          )}
        </BackgroundContainer>

        <RouteList isEditable />
      </SplitPane>
    </Container>
  );
};
