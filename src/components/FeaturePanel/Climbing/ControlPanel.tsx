import { IconButton } from '@material-ui/core';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import TimelineIcon from '@material-ui/icons/Timeline';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import UndoIcon from '@material-ui/icons/Undo';
import ClearIcon from '@material-ui/icons/Clear';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { ClimbingEditorContext } from './contexts/climbingEditorContext';
import { t } from '../../../services/intl';

const Container = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  position: absolute;
  width: 44px;
  top: 5px;
  left: 5px;
`;

export const ControlPanel = ({
  onFinishClimbingRouteClick,
  onCancelClimbingRouteClick,
  onCreateClimbingRouteClick,
  onDeleteExistingClimbingRouteClick,
  tempRoute,
  onUndoClick,
}) => {
  const { routeSelectedIndex, isSelectedRouteEditable, routes } = useContext(
    ClimbingEditorContext,
  );

  return (
    <Container>
      {isSelectedRouteEditable ? (
        <>
          <IconButton
            color="default"
            edge="end"
            onClick={onFinishClimbingRouteClick}
            title={t('climbingpanel.finish_climbing_route')}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="default"
            edge="end"
            onClick={onCancelClimbingRouteClick}
            title={t('climbingpanel.cancel_climbing_route')}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
          {tempRoute.path.length !== 0 && (
            <IconButton
              color="default"
              edge="end"
              onClick={onUndoClick}
              title="Undo last segment"
            >
              <UndoIcon fontSize="small" />
            </IconButton>
          )}
        </>
      ) : (
        <>
          <IconButton
            color="default"
            edge="end"
            onClick={onCreateClimbingRouteClick}
            title={t('climbingpanel.create_climbing_route')}
          >
            <TimelineIcon fontSize="small" />
          </IconButton>

          {routeSelectedIndex !== null &&
            routes[routeSelectedIndex]?.path?.length !== 0 && (
              <>
                <IconButton
                  color="default"
                  edge="end"
                  onClick={() => {}}
                  title="Add new point to existing route"
                >
                  <ControlPointIcon fontSize="small" />
                </IconButton>
                <IconButton
                  color="default"
                  edge="end"
                  onClick={onDeleteExistingClimbingRouteClick}
                  title={t('climbingpanel.delete_climbing_route', {
                    route: String(routeSelectedIndex),
                  })}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            )}
        </>
      )}
    </Container>
  );
};
