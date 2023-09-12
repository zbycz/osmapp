import React from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { t } from '../../../services/intl';

const GuideContainer = styled.div`
  padding: 10px;
`;
const ButtonsContainer = styled.div`
  margin-top: 10px;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

export const ControlPanel = ({
  onFinishClimbingRouteClick,
  isEditable,
  newRoute,
  onCancelClimbingRouteClick,
  onCreateClimbingRouteClick,
  onDeleteExistingClimbingRouteClick,
  routeSelectedIndex,
}) => (
  <GuideContainer>
    {isEditable ? (
      <>
        <Alert severity="info" variant="filled">
          {newRoute.length === 0
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
        {routeSelectedIndex !== null && (
          <Button
            onClick={onDeleteExistingClimbingRouteClick}
            color="secondary"
            variant="text"
            size="small"
            startIcon={<DeleteIcon />}
          >
            {t('climbingpanel.delete_climbing_route', {
              route: String(routeSelectedIndex),
            })}
          </Button>
        )}
      </ButtonsContainer>
    )}
  </GuideContainer>
);
