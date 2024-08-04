import React from 'react';
import styled from 'styled-components';

import { Button } from '@mui/material';
import { t } from '../../../services/intl';
import { useClimbingContext } from './contexts/ClimbingContext';
import { RouteNumber } from './RouteNumber';
import { useFeatureContext } from '../../utils/FeatureContext';
import { useSnackbar } from '../../utils/SnackbarContext';

const DrawRouteButton = styled(Button)`
  align-items: baseline;
`;
const Container = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
`;

export const Guide = () => {
  const { routeSelectedIndex, getMachine, getCurrentPath } =
    useClimbingContext();
  const machine = getMachine();
  const path = getCurrentPath();
  const showSnackbar = useSnackbar();

  const onDrawRouteClick = () => {
    showSnackbar(
      path.length === 0
        ? t('climbingpanel.create_first_node')
        : t('climbingpanel.create_next_node'),
      'info',
    );
    machine.execute('extendRoute', { routeNumber: routeSelectedIndex });
  };
  const isInSchema = path.length > 0;
  const showDrawButton =
    routeSelectedIndex !== null &&
    !isInSchema &&
    machine.currentStateName !== 'extendRoute';

  const {
    feature: {
      osmMeta: { id },
    },
  } = useFeatureContext();

  return (
    <Container>
      {showDrawButton && (
        <DrawRouteButton
          variant="contained"
          size="small"
          onClick={onDrawRouteClick}
        >
          {t('climbingpanel.draw_route')} &nbsp;
          <RouteNumber
            isSelected
            photoInfoForRoute="hasPathOnThisPhoto"
            osmId={id}
          >
            {routeSelectedIndex + 1}
          </RouteNumber>
        </DrawRouteButton>
      )}
    </Container>
  );
};
