import React, { useContext } from 'react';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { t } from '../../../services/intl';
import { ClimbingContext } from './contexts/ClimbingContext';

const GuideContainer = styled.div`
  padding: 10px;
`;

export const Guide = () => {
  const { isSelectedRouteEditable, routeSelectedIndex, routes } =
    useContext(ClimbingContext);

  return (
    <GuideContainer>
      {isSelectedRouteEditable && (
        <Alert severity="info" variant="filled">
          {routes[routeSelectedIndex].path.length === 0
            ? t('climbingpanel.create_first_node')
            : t('climbingpanel.create_next_node')}
        </Alert>
      )}
    </GuideContainer>
  );
};
