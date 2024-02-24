import React from 'react';
import styled from 'styled-components';

import { Tooltip, useTheme } from '@material-ui/core';
import { useConfig } from './config';

const useColor = ({
  isSelected,
  hasPathOnThisPhoto,
  isOnThisPhoto,
  hasPathInDifferentPhoto,
  isOnDifferentPhoto,
}) => {
  const theme: any = useTheme();
  const config = useConfig();

  if (hasPathOnThisPhoto && isSelected) {
    return {
      background: config.routeNumberBackgroundSelected,
      text: config.routeNumberTextColorSelected,
      border: `solid 1px ${config.routeNumberBorderColorSelected}`,
    };
  }
  if (hasPathOnThisPhoto) {
    return {
      background: config.routeNumberBackground,
      text: config.routeNumberTextColor,
      border: `solid 1px ${config.routeNumberBorderColor}`,
    };
  }
  if (isOnThisPhoto) {
    return {
      background: config.routeNumberBackground,
      text: config.routeNumberTextColor,
      border: `dashed 1px ${config.routeNumberBorderColor}`,
    };
  }
  if (hasPathInDifferentPhoto) {
    return {
      background: 'transparent',
      text: isSelected ? theme.textPrimaryDefault : theme.textDefault,
      border: `solid 1px ${config.routeNumberBorderColor}`,
    };
  }
  if (isOnDifferentPhoto) {
    return {
      background: 'transparent',
      text: isSelected ? theme.textPrimaryDefault : theme.textDefault,
      border: `dashed 1px ${config.routeNumberBorderColor}`,
    };
  }

  return {
    background: 'transparent',
    text: theme.textSubdued,
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

export const RouteNumber = ({ children, isSelected, photoInfoForRoute }) => {
  const hasPathOnThisPhoto = photoInfoForRoute === 'hasPathOnThisPhoto';
  const isOnThisPhoto = photoInfoForRoute === 'isOnThisPhoto';
  const hasPathInDifferentPhoto =
    photoInfoForRoute === 'hasPathInDifferentPhoto';
  const isOnDifferentPhoto = photoInfoForRoute === 'isOnDifferentPhoto';

  const colors = useColor({
    isSelected,
    hasPathOnThisPhoto,
    isOnThisPhoto,
    hasPathInDifferentPhoto,
    isOnDifferentPhoto,
  });

  const getTitle = () => {
    if (hasPathOnThisPhoto) {
      return 'Route has path on this photo';
    }
    if (isOnThisPhoto) {
      return 'Route is on this photo';
    }
    if (hasPathInDifferentPhoto) {
      return 'Route has path available on different photo';
    }
    if (isOnDifferentPhoto) {
      return 'Route is available on different photo';
    }
    return 'Route is not marked yet';
  };

  return (
    <Tooltip arrow title={getTitle()}>
      <Container colors={colors}>{children}</Container>
    </Tooltip>
  );
};
