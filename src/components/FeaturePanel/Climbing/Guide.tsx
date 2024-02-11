import React, { useState } from 'react';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { Button, Snackbar } from '@material-ui/core';
import { t } from '../../../services/intl';
import { useClimbingContext } from './contexts/ClimbingContext';
import { RouteNumber } from './RouteNumber';

const DrawRouteButton = styled(Button)`
  align-items: baseline;
`;

export const Guide = () => {
  const [isGuideClosed, setIsGuideClosed] = useState(false);
  const { routeSelectedIndex, getMachine, getCurrentPath } =
    useClimbingContext();
  const machine = getMachine();
  const path = getCurrentPath();

  const handleClose = () => {
    setIsGuideClosed(true);
  };
  const onDrawRouteClick = () => {
    machine.execute('extendRoute', { routeNumber: routeSelectedIndex });
  };
  const isInSchema = path.length > 0;
  const showDrawButton =
    !isInSchema && machine.currentStateName !== 'extendRoute';
  return (
    <Snackbar
      open={
        (machine.currentStateName === 'extendRoute' && !isGuideClosed) ||
        (routeSelectedIndex !== null && !isInSchema)
      }
      anchorOrigin={{
        vertical: showDrawButton ? 'bottom' : 'top',
        horizontal: showDrawButton ? 'left' : 'center',
      }}
    >
      {showDrawButton ? (
        <DrawRouteButton
          variant="contained"
          size="small"
          onClick={onDrawRouteClick}
        >
          Zakreslit cestu &nbsp;
          <RouteNumber isSelected hasRoute>
            {routeSelectedIndex + 1}
          </RouteNumber>
        </DrawRouteButton>
      ) : (
        <Alert onClose={handleClose} severity="info" variant="filled">
          {path.length === 0
            ? t('climbingpanel.create_first_node')
            : t('climbingpanel.create_next_node')}
        </Alert>
      )}
    </Snackbar>
  );
};
