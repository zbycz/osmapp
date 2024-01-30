import React from 'react';
import styled from 'styled-components';

import { useTheme } from '@material-ui/core';
import { useConfig } from './config';

const useColor = ({ isSelected, hasRoute, hasRouteInDifferentPhotos }) => {
  const theme: any = useTheme();
  const config = useConfig();

  if (hasRoute && isSelected) {
    return {
      background: config.routeNumberBackgroundSelected,
      text: config.routeNumberTextColorSelected,
      border: `solid 1px ${config.routeNumberBorderColorSelected}`,
    };
  }
  if (hasRoute) {
    return {
      background: config.routeNumberBackground,
      text: config.routeNumberTextColor,
      border: `solid 1px ${config.routeNumberBorderColor}`,
    };
  }
  if (hasRouteInDifferentPhotos) {
    return {
      background: 'transparent',
      text: isSelected ? theme.textPrimaryDefault : theme.textDefault,
      border: `dashed 1px ${config.routeNumberBorderColor}`,
    };
  }
  if (!hasRoute) {
    return {
      background: 'transparent',
      text: isSelected ? theme.textPrimaryDefault : theme.textDefault,
      border: 'solid 1px transparent',
    };
  }

  return {
    background: 'transparent',
    text: theme.textOnPrimary,
    border: 'solid 1px transparent',
  };
};

const Container = styled.div<{
  colors: Record<string, string>;
}>`
  width: 22px;
  height: 22px;
  line-height: 20px;
  border-radius: 50%;
  background: ${({ colors }) => colors.background};
  color: ${({ colors }) => colors.text};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 600;

  border: ${({ colors }) => colors.border};
`;

export const RouteNumber = ({
  children,
  isSelected,
  hasRoute,
  hasRouteInDifferentPhotos = false,
}) => {
  const colors = useColor({ isSelected, hasRoute, hasRouteInDifferentPhotos });

  const getTitle = () => {
    if (hasRoute) {
      return 'Route marked in schema';
    }
    if (hasRouteInDifferentPhotos) {
      return 'Route is available in different photo';
    }
    return 'Route is not in schema';
  };
  return (
    <Container colors={colors} title={getTitle()}>
      {children}
    </Container>
  );
};
