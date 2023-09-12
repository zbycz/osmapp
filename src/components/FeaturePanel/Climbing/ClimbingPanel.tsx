import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { RoutePaths } from './RoutePaths';
import { t } from '../../../services/intl';
import type { PathPoints } from './types';
import { ClimbingEditorContext } from './contexts/climbingEditorContext';

const Container = styled.div`
  position: relative;
`;

const Image2 = styled.img`
  width: 100%;
`;
const GuideContainer = styled.div`
  padding: 10px;
`;
const ButtonsContainer = styled.div`
  margin-top: 10px;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

export const ClimbingPanel = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [newPath, setNewPath] = useState<PathPoints>([]);
  const [pathData, setPathData] = useState<Array<PathPoints>>([]);
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
    setNewPath([]);
    setRouteSelected(pathData.length);
  };

  const onFinishClimbingRouteClick = () => {
    setIsEditable(false);
    setPathData([...pathData, newPath]);
    setNewPath([]);
    setRouteSelected(null);
  };
  const onCancelClimbingRouteClick = () => {
    setIsEditable(false);
    setNewPath([]);
    setRouteSelected(null);
  };
  const onDeleteExistingClimbingRouteClick = () => {
    setPathData(pathData.filter((_route, index) => index !== routeSelected));
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
      setNewPath([...newPath, newCoordinate]);
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
      <RoutePaths
        data={[...pathData, newPath]}
        isEditable={isEditable}
        onClick={onCanvasClick}
        routeSelected={routeSelected}
        onRouteSelect={onRouteSelect}
      />

      <GuideContainer>
        {isEditable ? (
          <>
            <Alert severity="info" variant="filled">
              {newPath.length === 0
                ? t('climbingpanel.create_first_node')
                : t('climbingpanel.create_next_node')}
            </Alert>
            <ButtonsContainer>
              <Button
                onClick={onFinishClimbingRouteClick}
                color="primary"
                variant="contained"
              >
                {t('climbingpanel.finish_climbing_route')}
              </Button>
              <Button onClick={onCancelClimbingRouteClick} color="secondary">
                {t('climbingpanel.cancel_climbing_route')}
              </Button>
            </ButtonsContainer>
          </>
        ) : (
          <ButtonsContainer>
            <Button
              onClick={onCreateClimbingRouteClick}
              color="primary"
              variant="contained"
            >
              {t('climbingpanel.create_climbing_route')}
            </Button>
            {routeSelected !== null && (
              <Button
                onClick={onDeleteExistingClimbingRouteClick}
                color="secondary"
                variant="text"
                size="small"
                startIcon={<DeleteIcon />}
              >
                {t('climbingpanel.delete_climbing_route', {
                  route: String(routeSelected),
                })}
              </Button>
            )}
          </ButtonsContainer>
        )}
      </GuideContainer>
    </Container>
  );
};
