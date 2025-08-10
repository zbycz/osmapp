/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from '@emotion/styled';
import { useClimbingContext } from '../contexts/ClimbingContext';
import { useRouteNumberColors } from '../utils/useRouteNumberColors';
import { isTicked } from '../../../../services/my-ticks/ticks';
import { useTheme } from '@mui/material';
import { RouteDifficulty } from './RouteDifficulty';
import { getShiftForStartPoint } from '../utils/startPoint';
import { getShortId } from '../../../../services/helpers';
import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';
import { useMobileMode } from '../../../helpers';

type Props = {
  routeIndex: number;
  x: number;
  y: number;
  osmId: string;
};

const Text = styled.text<{ $scale: number }>`
  user-select: none;
  font-size: ${({ $scale }) => 12 / $scale}px;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
`;

const RouteNameBoxBase = styled.rect`
  pointer-events: all;
`;

const HoverableRouteName = RouteNameBoxBase;
const RouteNameOutline = RouteNameBoxBase;
const RouteNameBox = RouteNameBoxBase;

const CheckCircle = ({ x, y, scale }) => {
  const theme = useTheme();
  return (
    <g
      transform={`translate(${x + 3} ${y - 17}) scale(0.5) scale(${1 / scale})`}
      x={x}
      y={y}
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8z"
        fill={theme.palette.success.main}
      />
    </g>
  );
};

const RouteNumberBadge = ({ routeIndex, x, y, osmId }: Props) => {
  const isMobileMode = useMobileMode();
  const {
    imageSize,
    photoZoom,
    isRouteSelected,
    getMachine,
    isEditMode,
    routeIndexHovered,
    setRouteIndexHovered,
  } = useClimbingContext();
  const digits = String(routeIndex).length;
  const RECT_WIDTH = ((digits > 2 ? digits : 0) * 3 + 18) / photoZoom.scale;
  const RECT_HEIGHT = 18 / photoZoom.scale;
  const RECT_Y_OFFSET = 8 / photoZoom.scale;
  const OUTLINE_WIDTH = 2 / photoZoom.scale;
  const HOVER_WIDTH = 10 / photoZoom.scale;
  const TEXT_Y_SHIFT = 13 / photoZoom.scale;

  const getX = () => {
    const isFarRight = x + RECT_WIDTH / 2 + OUTLINE_WIDTH > imageSize.width;
    const isFarLeft = x < RECT_WIDTH / 2 + OUTLINE_WIDTH;
    if (isFarRight) {
      return imageSize.width - RECT_WIDTH / 2 - OUTLINE_WIDTH;
    }
    if (isFarLeft) {
      return RECT_WIDTH / 2 + OUTLINE_WIDTH;
    }
    return x;
  };

  const getY = () => {
    const isFarBottom = y + RECT_Y_OFFSET + RECT_HEIGHT > imageSize.height;
    if (isFarBottom) return imageSize.height - RECT_HEIGHT - OUTLINE_WIDTH;
    return y + RECT_Y_OFFSET;
  };

  const onMouseEnter = isMobileMode
    ? undefined
    : () => {
        setRouteIndexHovered(routeIndex);
      };

  const onMouseLeave = isMobileMode
    ? undefined
    : () => {
        setRouteIndexHovered(null);
      };

  const newX = getX(); // this shifts X coordinate in case of too small photo
  const newY = getY(); // this shifts Y coordinate in case of too small photo

  const machine = getMachine();
  const commonProps = {
    cursor: 'pointer',
    pointerEvents: 'none',
    onClick: (e) => {
      if (isEditMode) {
        machine.execute('editRoute', { routeNumber: routeIndex });
      } else {
        machine.execute('routeSelect', { routeNumber: routeIndex });
      }
      e.stopPropagation();
    },
    onMouseEnter,
    onMouseLeave,
  };
  const isSelected = isRouteSelected(routeIndex);

  const colors = useRouteNumberColors({
    isSelected: isSelected || routeIndexHovered === routeIndex,
    hasPathOnThisPhoto: true,
  });

  return (
    <>
      <HoverableRouteName
        x={newX - RECT_WIDTH / 2 - HOVER_WIDTH / 2}
        y={newY - HOVER_WIDTH / 2}
        width={RECT_WIDTH + HOVER_WIDTH}
        height={RECT_HEIGHT + HOVER_WIDTH}
        rx="10"
        fill="transparent"
        {...commonProps}
      />

      <RouteNameOutline
        x={newX - RECT_WIDTH / 2 - OUTLINE_WIDTH / 2}
        y={newY - OUTLINE_WIDTH / 2}
        width={RECT_WIDTH + OUTLINE_WIDTH}
        height={RECT_HEIGHT + OUTLINE_WIDTH}
        rx="10"
        fill={colors.border}
        {...commonProps}
      />
      <RouteNameBox
        x={newX - RECT_WIDTH / 2}
        y={newY}
        width={RECT_WIDTH}
        height={RECT_HEIGHT}
        rx="10"
        fill={colors.background}
        {...commonProps}
      />
      {isTicked(osmId) && (
        <CheckCircle x={newX} y={newY + TEXT_Y_SHIFT} scale={photoZoom.scale} />
      )}
      <Text
        x={newX}
        y={newY + TEXT_Y_SHIFT}
        $scale={photoZoom.scale}
        fill={colors.text}
        textAnchor="middle"
        {...commonProps}
      >
        {routeIndex + 1}
      </Text>
    </>
  );
};

export const RouteNumber = ({ routeIndex }: { routeIndex: number }) => {
  const { getPixelPosition, getPathForRoute, routes, photoPath, photoZoom } =
    useClimbingContext();
  const { userSettings } = useUserSettingsContext();

  const route = routes[routeIndex];
  const path = getPathForRoute(route);
  if (!route || !path || path?.length === 0) return null;

  const shift =
    getShiftForStartPoint({
      currentRouteSelectedIndex: routeIndex,
      currentPosition: path[0],
      checkedRoutes: routes,
      photoPath,
    }) / photoZoom.scale;

  const { x, y } = getPixelPosition({
    ...path[0],
    units: 'percentage',
  });
  const osmId = route.feature?.osmMeta
    ? getShortId(route.feature.osmMeta)
    : null;

  return (
    <>
      <RouteNumberBadge
        routeIndex={routeIndex}
        x={x + shift}
        y={y}
        osmId={osmId}
      />
      {userSettings['climbing.isGradesOnPhotosVisible'] && (
        <RouteDifficulty x={x + shift} y={y + 40} route={route} />
      )}
    </>
  );
};
