import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import SplitPane from 'react-split-pane';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { CircularProgress, IconButton, useTheme } from '@mui/material';
import { TransformComponent } from 'react-zoom-pan-pinch';
import { useClimbingContext } from './contexts/ClimbingContext';
import { RouteList } from './RouteList/RouteList';
import { RoutesEditor } from './Editor/RoutesEditor';
import { Guide } from './Guide';
import { ControlPanel } from './Editor/ControlPanel';
import { useFeatureContext } from '../../utils/FeatureContext';
import { RouteDistribution } from './RouteDistribution';
import {
  getResolution,
  getWikimediaCommonsKeys,
  removeFilePrefix,
} from './utils/photo';
import { useScrollShadow } from './utils/useScrollShadow';
import { TransformWrapper } from './TransformWrapper';
import { convertHexToRgba } from '../../utils/colorUtils';
import { getCommonsImageUrl } from '../../../services/images/getCommonsImageUrl';

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
      color: ${({ theme }) => theme.palette.primary.main};
      letter-spacing: 1px;
    }

    &:hover {
      &::before {
        background-color: ${({ theme }) => theme.palette.primary.main};
        border: solid 1px ${({ theme }) => theme.palette.primary.main};
        color: ${({ theme }) => theme.palette.primary.contrastText};
      }
      &::after {
        border-color: ${({ theme }) => theme.palette.primary.main};
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
    overflow: hidden;
  }
`;
const BottomPanel = styled.div`
  height: 100%;
  overflow: auto;
`;

const MiniLoadingContainer = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  z-index: 1;
  background: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.default, 0.3)};
  -webkit-backdrop-filter: blur(22px);
  backdrop-filter: blur(22px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FullLoadingContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  background: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.default, 0.7)};
  -webkit-backdrop-filter: blur(40px);
  backdrop-filter: blur(40px);
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const ArrowExpanderContainer = styled.div`
  position: absolute;
  z-index: 1000000;
  width: 100%;
  top: -6px;
`;

const ArrowExpanderButton = styled.div<{ $arrowOnTop?: boolean }>`
  background: ${({ theme }) => theme.palette.background.default};
  width: 30px;
  height: 30px;
  margin: auto;
  border-radius: 50%;
  ${({ $arrowOnTop }) =>
    $arrowOnTop
      ? undefined
      : `
  bottom: 0;
  border-radius: 50%;
  `};
  justify-content: center;
  display: flex;
`;

const BlurContainer = styled.div`
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  background-color: rgba(0, 0, 0, 0.6);
  height: 100%;
`;

const BackgroundContainer = styled.div<{
  $imageHeight: number;
  $imageUrl: string;
}>`
  transition: 0.3s all;
  background: #111 ${({ $imageUrl }) => `url(${$imageUrl}) no-repeat`};
  background-size: cover;
  background-position: center;
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
`;

const MainContent = () => (
  <>
    <RouteList isEditable />
    <RouteDistribution />
  </>
);

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

export const ClimbingView = ({ photo }: { photo?: string }) => {
  const {
    imageSize,
    routeSelectedIndex,
    getMachine,
    splitPaneHeight,
    setSplitPaneHeight,
    isEditMode,
    viewportSize,
    editorPosition,
    photoPath,
    loadPhotoRelatedData,
    areRoutesLoading,
    preparePhotosAndSet,
    photoZoom,
    loadedPhotos,
  } = useClimbingContext();
  const { feature } = useFeatureContext();

  const [photoResolution, setPhotoResolution] = useState(200);
  const [isSplitViewDragging, setIsSplitViewDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(null);
  const machine = getMachine();

  useEffect(() => {
    if (isEditMode && machine.currentStateName === 'routeSelected') {
      machine.execute('editRoute', { routeNumber: routeSelectedIndex }); // možná tímhle nahradit isEditMode
    }

    if (!isEditMode && machine.currentStateName === 'editRoute') {
      machine.execute('routeSelect', { routeNumber: routeSelectedIndex });
    }
  }, [isEditMode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadPhotoRelatedData();
  }, [splitPaneHeight]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadPhotoRelatedData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onDragStarted = () => {
    setIsSplitViewDragging(true);
  };
  const onDragFinished = (splitHeight) => {
    setSplitPaneHeight(splitHeight);
    setIsSplitViewDragging(false);
  };
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  const cragPhotos = getWikimediaCommonsKeys(feature.tags)
    .map((key) => feature.tags[key])
    .map(removeFilePrefix);
  preparePhotosAndSet(cragPhotos, photo);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const resolution = getResolution({
      windowDimensions,
      photoPath,
      photoZoom,
      loadedPhotos,
    });
    setPhotoResolution(resolution);

    const url = getCommonsImageUrl(`File:${photoPath}`, resolution);
    setImageUrl(url);
    if (!backgroundImageUrl) {
      setBackgroundImageUrl(url);
    }
  }, [photoPath, photoZoom.scale, windowDimensions]); // eslint-disable-line react-hooks/exhaustive-deps

  const showArrowOnTop = splitPaneHeight === 0;
  const showArrowOnBottom =
    splitPaneHeight === viewportSize.height - editorPosition.y;

  const {
    scrollElementRef,
    onScroll,
    ShadowContainer,
    ShadowTop,
    ShadowBottom,
  } = useScrollShadow([areRoutesLoading]);
  const theme = useTheme();

  const isResolutionLoaded =
    loadedPhotos?.[photoPath]?.[photoResolution] || false;
  const resolutions = loadedPhotos?.[photoPath];
  const isFirstPhotoLoaded =
    resolutions &&
    Object.keys(resolutions).filter((key) => resolutions[key] === true).length >
      0;

  return (
    <Container>
      {(showArrowOnTop || showArrowOnBottom) && (
        <ArrowExpanderContainer>
          <ArrowExpanderButton $arrowOnTop={showArrowOnTop}>
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
      {photoPath ? (
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
            $imageHeight={imageSize.height}
            $imageUrl={backgroundImageUrl}
          >
            <>
              {!isResolutionLoaded && (
                <MiniLoadingContainer>
                  <CircularProgress color="primary" size={14} thickness={6} />
                </MiniLoadingContainer>
              )}
              {!isFirstPhotoLoaded && (
                <FullLoadingContainer>
                  <CircularProgress color="primary" />
                </FullLoadingContainer>
              )}
              <BlurContainer>
                <TransformWrapper>
                  <TransformComponent
                    wrapperStyle={{ height: '100%', width: '100%' }}
                    contentStyle={{ height: '100%', width: '100%' }}
                  >
                    <>
                      <RoutesEditor
                        isRoutesLayerVisible={
                          !isSplitViewDragging && !areRoutesLoading
                        }
                        imageUrl={imageUrl}
                        photoResolution={photoResolution}
                      />
                    </>
                  </TransformComponent>
                </TransformWrapper>
                {isEditMode && (
                  <>
                    <ControlPanel />
                    <Guide />
                  </>
                )}
              </BlurContainer>
            </>
          </BackgroundContainer>

          <ShadowContainer>
            <ShadowTop backgroundColor={theme.palette.background.paper} />
            <BottomPanel onScroll={onScroll} ref={scrollElementRef}>
              <MainContent />
            </BottomPanel>
            <ShadowBottom backgroundColor={theme.palette.background.paper} />
          </ShadowContainer>
        </SplitPane>
      ) : (
        <MainContent />
      )}
    </Container>
  );
};
