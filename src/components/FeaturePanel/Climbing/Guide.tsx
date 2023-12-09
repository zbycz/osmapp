import React, { useState } from 'react';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { Button, Snackbar } from '@material-ui/core';
import { t } from '../../../services/intl';
import { useClimbingContext } from './contexts/ClimbingContext';
import { RouteNumber } from './RouteNumber';

const GuideContainer = styled.div`
  padding: 10px;
`;

const DrawRouteButton = styled(Button)`
  align-items: baseline;
`;

export const Guide = () => {
  const [isGuideClosed, setIsGuideClosed] = useState(false);
  const { routeSelectedIndex, routes, getMachine } = useClimbingContext();
  const machine = getMachine();

  const handleClose = () => {
    setIsGuideClosed(true);
  };
  const onDrawRouteClick = () => {
    machine.execute('extendRoute', { routeNumber: routeSelectedIndex });
  };
  const isInSchema = routes[routeSelectedIndex]?.path.length > 0;
  const showDrawButton =
    !isInSchema && machine.currentStateName !== 'extendRoute';
  return (
    <GuideContainer>
      <Snackbar
        open={
          (machine.currentStateName === 'extendRoute' && !isGuideClosed) ||
          (routeSelectedIndex !== null && !isInSchema)
        }
        // autoHideDuration={6000}

        anchorOrigin={{
          vertical: showDrawButton ? 'bottom' : 'top',
          horizontal: showDrawButton ? 'right' : 'center',
        }}
        // onClose={handleClose}
      >
        {/* <Alert
          onClose={handleClose}
          severity="warning"
          variant="filled"
          action={
            <Button color="inherit" size="small">
              Add route to scheme
            </Button>
          }
        >
          Selected route is not in scheme
        </Alert> */}

        {showDrawButton ? (
          <DrawRouteButton
            variant="contained"
            size="small"
            onClick={onDrawRouteClick}
          >
            Zakreslit cestu &nbsp;
            <RouteNumber isSelected>{routeSelectedIndex + 1}</RouteNumber>
            {/* Tato cesta zatím není zakreslena na fotce. */}
          </DrawRouteButton>
        ) : (
          <Alert onClose={handleClose} severity="info" variant="filled">
            {routes[routeSelectedIndex]?.path.length === 0
              ? t('climbingpanel.create_first_node')
              : t('climbingpanel.create_next_node')}
          </Alert>
        )}
      </Snackbar>
    </GuideContainer>
  );
};
