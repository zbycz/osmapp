import React, { useContext, useRef } from 'react';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
// import ZoomInIcon from '@material-ui/icons/ZoomIn';
// import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { RouteEditor } from './Editor/RouteEditor';
import { ClimbingContext } from './contexts/climbingContext';
import { ControlPanel } from './Editor/ControlPanel';
import { RouteList } from './RouteList';
import { emptyRoute } from './utils/emptyRoute';
import { Guide } from './Guide';

type Props = {
  setIsFullscreenDialogOpened: (isFullscreenDialogOpened: boolean) => void;
  isFullscreenDialogOpened: boolean;
  isReadOnly: boolean;
  onEditorClick?: () => void;
};

const Container = styled.div`
  position: relative;
`;

const ImageContainer = styled.div``;

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
  // const [zoom, setZoom] = useState<number>(1);

  const {
    setImageSize,
    imageSize,
    isSelectedRouteEditable,
    setIsSelectedRouteEditable,
    setRouteSelectedIndex,
    routes,
    setRoutes,
    routeSelectedIndex,
    updateRouteOnIndex,
    setEditorPosition,
  } = useContext(ClimbingContext);

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
    setRoutes([...routes, emptyRoute]);
    setRouteSelectedIndex(routes.length);
  };

  const onCreateSchemaForExistingRouteClick = (
    updatedRouteSelectedIndex: number,
  ) => {
    setIsSelectedRouteEditable(true);
    updateRouteOnIndex(updatedRouteSelectedIndex, (route) => ({
      ...route,
      path: [],
    }));
    setRouteSelectedIndex(updatedRouteSelectedIndex);
  };

  const onDeleteExistingRouteClick = (deletedExistingRouteIndex: number) => {
    setIsSelectedRouteEditable(false);
    setRouteSelectedIndex(null);
    updateRouteOnIndex(deletedExistingRouteIndex);
  };

  const onFinishClimbingRouteClick = () => {
    setIsSelectedRouteEditable(false);
  };

  const onEditClimbingRouteClick = () => {
    setIsSelectedRouteEditable(true);
  };

  const onDeleteExistingClimbingRouteClick = () => {
    setIsSelectedRouteEditable(false);
    updateRouteOnIndex(routeSelectedIndex);
    setRouteSelectedIndex(null);
  };

  const onCanvasClick = (e) => {
    const isDoubleClick = e.detail === 2;

    if (isSelectedRouteEditable) {
      const rect = e.target.getBoundingClientRect();
      setEditorPosition({ left: rect.left, top: rect.top });

      const newCoordinate = {
        x: (e.clientX - rect.left) / imageSize.width,
        y: (e.clientY - rect.top) / imageSize.height,
      };
      updateRouteOnIndex(routeSelectedIndex, (route) => ({
        ...route,
        path: [...route.path, newCoordinate],
      }));

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

  const onUndoClick = () => {
    updateRouteOnIndex(routeSelectedIndex, (route) => ({
      ...route,
      path: route.path.slice(0, -1),
    }));
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
          // zoom={zoom}
        />
      </ImageContainer>
      <RouteEditor
        routes={routes}
        onClick={onEditorClick || onCanvasClick}
        onRouteSelect={onRouteSelect}
      />

      {!isReadOnly && (
        <ControlPanel
          onEditClimbingRouteClick={onEditClimbingRouteClick}
          onFinishClimbingRouteClick={onFinishClimbingRouteClick}
          onDeleteExistingClimbingRouteClick={
            onDeleteExistingClimbingRouteClick
          }
          onCreateClimbingRouteClick={onCreateClimbingRouteClick}
          onUndoClick={onUndoClick}
        />
      )}
      <Guide />

      <RouteList
        isReadOnly={isReadOnly}
        onCreateSchemaForExistingRouteClick={
          onCreateSchemaForExistingRouteClick
        }
        onDeleteExistingRouteClick={onDeleteExistingRouteClick}
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
