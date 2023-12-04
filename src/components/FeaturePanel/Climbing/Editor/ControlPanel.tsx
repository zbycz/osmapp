import { IconButton } from '@material-ui/core';
// import ControlPointIcon from '@material-ui/icons/ControlPoint';
// import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import UndoIcon from '@material-ui/icons/Undo';
import React from 'react';
import styled from 'styled-components';
import { t } from '../../../../services/intl';
import { useClimbingContext } from '../contexts/ClimbingContext';

const Container = styled.div`
  background: ${({ theme }) => theme.palette.background.default};
  border-radius: 8px;
  position: absolute;
  width: 44px;
  top: 5px;
  left: 5px;
  z-index: 1;
`;

export const ControlPanel = () => {
  const { routeSelectedIndex, routes, getMachine } = useClimbingContext();
  const machine = getMachine();

  const onUndoClick = () => {
    machine.execute('undoPoint');
  };

  // const onFinishClimbingRouteClick = () => {
  //   machine.execute('finishRoute');
  // };

  return (
    <Container>
      <>
        {/* {(machine.currentStateName === 'editRoute' ||
          machine.currentStateName === 'extendRoute') && (
          <IconButton
            color="default"
            edge="end"
            onClick={onFinishClimbingRouteClick}
            title={t('climbingpanel.finish_climbing_route')}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
        )} */}

        {machine.currentStateName === 'extendRoute' &&
          routes[routeSelectedIndex]?.path.length !== 0 && (
            <IconButton
              color="default"
              edge="end"
              onClick={onUndoClick}
              title="Undo last segment"
            >
              <UndoIcon fontSize="small" />
            </IconButton>
          )}
        {/* <IconButton
            color="default"
            edge="end"
            onClick={onDeleteExistingClimbingRouteClick}
            title={t('climbingpanel.delete_climbing_route')}
          >
            <DeleteIcon fontSize="small" />
          </IconButton> */}
      </>
      {machine.currentStateName !== 'editRoute' &&
        machine.currentStateName !== 'extendRoute' && (
          <>
            {/* <IconButton
              color="default"
              edge="end"
              onClick={onCreateClimbingRouteClick}
              title={t('climbingpanel.create_climbing_route')}
            >
              <ControlPointIcon fontSize="small" />
            </IconButton> */}

            {/* {routeSelectedIndex !== null && (
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
            )} */}
          </>
        )}
    </Container>
  );
};
