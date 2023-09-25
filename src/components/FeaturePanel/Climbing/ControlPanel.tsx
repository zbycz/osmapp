import { IconButton } from '@material-ui/core';
import TimelineIcon from '@material-ui/icons/Timeline';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import UndoIcon from '@material-ui/icons/Undo';
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
  onEditClimbingRouteClick,
  onFinishClimbingRouteClick,
  onDeleteExistingClimbingRouteClick,
  onCreateClimbingRouteClick,
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

          {routes[routeSelectedIndex].path.length !== 0 && (
            <IconButton
              color="default"
              edge="end"
              onClick={onUndoClick}
              title="Undo last segment"
            >
              <UndoIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            color="default"
            edge="end"
            onClick={onDeleteExistingClimbingRouteClick}
            title={t('climbingpanel.delete_climbing_route')}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
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
                  onClick={onEditClimbingRouteClick}
                  title={t('climbingpanel.edit_climbing_route')}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </>
            )}
        </>
      )}
    </Container>
  );
};
