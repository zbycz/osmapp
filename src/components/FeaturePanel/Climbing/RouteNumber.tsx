import React from 'react';
import styled from '@emotion/styled';

import { Tooltip } from '@mui/material';
import { useRouteNumberColors } from './utils/useRouteNumberColors';
import { isTicked } from '../../../services/ticks';

const Container = styled.div<{
  $colors: Record<string, string>;
}>`
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  background: ${({ $colors }) => $colors.background};
  color: ${({ $colors }) => $colors.text};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 600;

  border: ${({ $colors }) => $colors.border};
`;

export const RouteNumber = ({
  children,
  isSelected,
  photoInfoForRoute,
  osmId,
}) => {
  const hasPathOnThisPhoto = photoInfoForRoute === 'hasPathOnThisPhoto';
  const isOnThisPhoto = photoInfoForRoute === 'isOnThisPhoto';
  const hasPathInDifferentPhoto =
    photoInfoForRoute === 'hasPathInDifferentPhoto';
  const isOnDifferentPhoto = photoInfoForRoute === 'isOnDifferentPhoto';

  const colors = useRouteNumberColors({
    isSelected,
    hasPathOnThisPhoto,
    isOnThisPhoto,
    hasPathInDifferentPhoto,
    isOnDifferentPhoto,
    isTicked: isTicked(osmId),
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
      <Container $colors={colors}>{children}</Container>
    </Tooltip>
  );
};
