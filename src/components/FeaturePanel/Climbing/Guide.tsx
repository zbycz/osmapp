import React from 'react';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { t } from '../../../services/intl';
import { useClimbingContext } from './contexts/ClimbingContext';

const GuideContainer = styled.div`
  padding: 10px;
`;

export const Guide = () => {
  const { isSelectedRouteEditable, routeSelectedIndex, routes } =
    useClimbingContext();

  return (
    isSelectedRouteEditable && (
      <GuideContainer>
        <Alert severity="info" variant="filled">
          {routes[routeSelectedIndex]?.path.length === 0
            ? t('climbingpanel.create_first_node')
            : t('climbingpanel.create_next_node')}
        </Alert>
      </GuideContainer>
    )
  );
};
