import React, { useState } from 'react';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import { t } from '../../../services/intl';
import { useClimbingContext } from './contexts/ClimbingContext';

const GuideContainer = styled.div`
  padding: 10px;
`;

export const Guide = () => {
  const [isGuideClosed, setIsGuideClosed] = useState(false);
  const { isSelectedRouteEditable, routeSelectedIndex, routes } =
    useClimbingContext();

  const handleClose = () => {
    setIsGuideClosed(true);
  };
  return (
    <GuideContainer>
      <Snackbar
        open={isSelectedRouteEditable && !isGuideClosed}
        // autoHideDuration={6000}

        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        // onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="info" variant="filled">
          {routes[routeSelectedIndex]?.path.length === 0
            ? t('climbingpanel.create_first_node')
            : t('climbingpanel.create_next_node')}
        </Alert>
      </Snackbar>
    </GuideContainer>
  );
};
