import React, { useState } from 'react';
import styled from '@emotion/styled';

import { Button, Snackbar, Alert } from '@mui/material';
import { t } from '../../../services/intl';
import { useClimbingContext } from './contexts/ClimbingContext';
import { RouteNumber } from './RouteNumber';
import { useFeatureContext } from '../../utils/FeatureContext';
import { isTicked } from '../../../services/ticks';
import { getWikimediaCommonsPhotoPathKeys } from './utils/photo';
import { getShortId } from '../../../services/helpers';

const DrawRouteButton = styled(Button)`
  align-items: baseline;
`;

export const Guide = () => {
  const [isGuideClosed, setIsGuideClosed] = useState(false);
  const { routeSelectedIndex, getMachine, getCurrentPath } =
    useClimbingContext();
  const machine = getMachine();
  const path = getCurrentPath();
  const { feature } = useFeatureContext();

  const handleClose = () => {
    setIsGuideClosed(true);
  };
  const onDrawRouteClick = () => {
    machine.execute('extendRoute', { routeNumber: routeSelectedIndex });
  };
  const isInSchema = path.length > 0;
  const showDrawButton =
    !isInSchema && machine.currentStateName !== 'extendRoute';

  const {
    feature: { osmMeta },
  } = useFeatureContext();
  const photoPathsCount = getWikimediaCommonsPhotoPathKeys(feature.tags).length;
  const hasTick = isTicked(getShortId(osmMeta));

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
          {t('climbingpanel.draw_route')} &nbsp;
          <RouteNumber
            hasCircle={photoPathsCount > 0}
            hasTick={hasTick}
            hasTooltip={false}
          >
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
