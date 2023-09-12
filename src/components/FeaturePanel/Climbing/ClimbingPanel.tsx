import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { RouteEditor } from './RouteEditor';
import type { ClimbingRoute } from './types';
import { ClimbingEditorContext } from './contexts/climbingEditorContext';
import { ControlPanel } from './ControlPanel';
import { RouteList } from './RouteList';

const Container = styled.div`
  position: relative;
`;

const Image2 = styled.img`
  width: 100%;
`;

export const ClimbingPanel = () => {
  const emptyRoute = { name: '', difficulty: '', length: '', path: [] };
  const [isEditable, setIsEditable] = useState(false);
  const [newRoute, setNewRoute] = useState<ClimbingRoute>(null);
  const [routes, setRoutes] = useState<Array<ClimbingRoute>>([]);
  const [routeSelected, setRouteSelected] = useState<number>(null);

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
    setRouteSelected(routes.length);
  };

  const onFinishClimbingRouteClick = () => {
    setIsEditable(false);
    setRoutes([...routes, newRoute]);
    setNewRoute(null);
    setRouteSelected(null);
  };
  const onCancelClimbingRouteClick = () => {
    setIsEditable(false);
    setNewRoute(null);
    setRouteSelected(null);
  };
  const onDeleteExistingClimbingRouteClick = () => {
    setRoutes(routes.filter((_route, index) => index !== routeSelected));
    setRouteSelected(null);
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
      setRouteSelected(null);
    }
  };

  const onRouteSelect = (routeNumber: number) => {
    setRouteSelected(routeNumber);
  };

  return (
    <Container>
      <Image2 src="https://upload.zby.cz/screenshot-2023-09-12-at-17.12.24.png" />
      {/* <Image src="https://www.skalnioblasti.cz/image.php?typ=skala&id=13516" /> */}
      <RouteEditor
        routes={[...routes, newRoute]}
        isEditable={isEditable}
        onClick={onCanvasClick}
        routeSelected={routeSelected}
        onRouteSelect={onRouteSelect}
      />

      <ControlPanel
        onFinishClimbingRouteClick={onFinishClimbingRouteClick}
        isEditable={isEditable}
        newRoute={newRoute}
        onCancelClimbingRouteClick={onCancelClimbingRouteClick}
        onCreateClimbingRouteClick={onCreateClimbingRouteClick}
        onDeleteExistingClimbingRouteClick={onDeleteExistingClimbingRouteClick}
        routeSelected={routeSelected}
      />

      <RouteList
        routes={routes}
        routeSelected={routeSelected}
        setRoutes={setRoutes}
      />
    </Container>
  );
};
