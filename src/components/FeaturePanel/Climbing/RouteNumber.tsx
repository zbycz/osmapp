import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@material-ui/core';
import { useConfig } from './config';

const useColor = ({ isSelected, hasRoute }) => {
  const theme = useTheme();
  const config = useConfig();

  if (!hasRoute) {
    return {
      background: 'transparent',
      text: isSelected ? theme.textPrimaryDefault : theme.textDefault,
      border: 'transparent',
    };
  }

  if (isSelected) {
    return {
      background: config.routeNumberBackgroundSelected,
      text: config.routeNumberTextColorSelected,
      border: config.routeNumberBorderColorSelected,
    };
  }
  if (hasRoute) {
    return {
      background: config.routeNumberBackground,
      text: config.routeNumberTextColor,
      border: config.routeNumberBorderColor,
    };
  }
  return {
    background: 'transparent',
    text: theme.textOnPrimary,
    border: 'transparent',
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

  border: solid 1px ${({ colors }) => colors.border};
`;

export const RouteNumber = ({ children, isSelected, hasRoute }) => {
  const colors = useColor({ isSelected, hasRoute });

  const getTitle = () => {
    if (hasRoute) {
      return 'Route marked in schema';
    }
    return 'Route is not in schema';
  };
  return (
    <Container colors={colors} title={getTitle()}>
      {children}
    </Container>
  );
};
