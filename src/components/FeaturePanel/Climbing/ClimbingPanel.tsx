import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
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

export const ClimbingPanel = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [newRoute, setNewRoute] = useState<ClimbingRoute>(null);
  const [routes, setRoutes] = useState<Array<ClimbingRoute>>([]);
  const [routeSelectedIndex, setRouteSelectedIndex] = useState<number>(null);

  const { setImageSize, imageSize } = useContext(ClimbingEditorContext);

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setImageSize({ width: image.width, height: image.height });
    };
    image.src = 'https://upload.zby.cz/screenshot-2023-09-12-at-17.12.24.png';
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
      <ImageElement src="https://upload.zby.cz/screenshot-2023-09-12-at-17.12.24.png" />
      {/* <Image src="https://www.skalnioblasti.cz/image.php?typ=skala&id=13516" /> */}
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
      />
    </Container>
  );
};
