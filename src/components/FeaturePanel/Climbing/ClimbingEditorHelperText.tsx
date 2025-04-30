import React from 'react';
import styled from '@emotion/styled';
import { Button, Alert } from '@mui/material';
import { useClimbingContext } from './contexts/ClimbingContext';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getWikimediaCommonsPhotoPathKeys } from './utils/photo';
import { RouteNumber } from './RouteNumber';
import { t } from '../../../services/intl';
import { useMobileMode } from '../../helpers';
import { type } from 'node:os';

const InlineBlockContainer = styled.div`
  display: inline-block;
`;

export const ClimbingEditorHelperText = () => {
  const { routeSelectedIndex, getCurrentPath, getMachine } =
    useClimbingContext();
  const { feature } = useFeatureContext();
  const machine = getMachine();

  const routePhotoPathsCount = getWikimediaCommonsPhotoPathKeys(
    feature.memberFeatures[routeSelectedIndex]?.tags ?? {},
  ).length;

  const onDrawRouteClick = () => {
    machine.execute('extendRoute', { routeNumber: routeSelectedIndex });
  };
  const path = getCurrentPath();
  const isInSchema = path.length > 0;
  const isMobileMode = useMobileMode();

  const DrawButton = () => (
    <Button
      color="info"
      variant="contained"
      size="small"
      onClick={onDrawRouteClick}
      endIcon={
        <RouteNumber hasCircle={true} hasTick={false} hasTooltip={false}>
          {routeSelectedIndex + 1}
        </RouteNumber>
      }
    >
      {t('climbingpanel.draw_route')}
    </Button>
  );

  return (
    <>
      {!isMobileMode && (
        <>
          {routeSelectedIndex === null && (
            <Alert severity="info">
              {t('climbingpanel.select_route_to_draw')}
            </Alert>
          )}

          {machine.currentStateName !== 'extendRoute' &&
            routeSelectedIndex !== null &&
            isInSchema &&
            routePhotoPathsCount > 0 && (
              <Alert severity="info">
                {t('climbingpanel.update_route_1')}{' '}
                <InlineBlockContainer>
                  <RouteNumber
                    hasCircle={true}
                    hasTick={false}
                    hasTooltip={false}
                  >
                    {routeSelectedIndex + 1}
                  </RouteNumber>
                </InlineBlockContainer>{' '}
                {t('climbingpanel.update_route_2')}
              </Alert>
            )}

          {machine.currentStateName === 'extendRoute' && !isInSchema && (
            <Alert severity="info">
              {t('climbingpanel.create_first_node')}
            </Alert>
          )}
          {machine.currentStateName === 'extendRoute' && isInSchema && (
            <Alert severity="info">{t('climbingpanel.create_next_node')}</Alert>
          )}
        </>
      )}

      {machine.currentStateName !== 'extendRoute' &&
        routeSelectedIndex !== null &&
        !isInSchema && (
          <>
            {isMobileMode ? (
              <DrawButton />
            ) : (
              <Alert severity="info" action={<DrawButton />}>
                {t('climbingpanel.route_not_drawn_yet')}
              </Alert>
            )}
          </>
        )}
    </>
  );
};
