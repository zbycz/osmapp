import React from 'react';
import styled from '@emotion/styled';

import { Tooltip } from '@mui/material';
import { useRouteNumberColors } from './utils/useRouteNumberColors';
import { isTicked } from '../../../services/ticks';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Container = styled.div`
  position: relative;
`;
const TickCheckContainer = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 12px;
`;

const Circle = styled.div<{
  $hasCircle: boolean;
}>`
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  background: ${({ theme, $hasCircle }) =>
    $hasCircle ? theme.palette.climbing.primary : undefined};
  color: ${({ theme, $hasCircle }) =>
    $hasCircle ? theme.palette.climbing.secondary : '#999'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
`;

export const RouteNumber = ({
  children,
  hasCircle = false,
  hasTick = false,
  hasTooltip = true,
}) => {
  const getTitle = () => {
    if (hasTick) {
      return 'You ticked this route';
    }
    if (hasCircle) {
      return 'Route has marked path';
    }
    return 'Route has no marked path';
  };

  return (
    <Tooltip arrow title={hasTooltip ? getTitle() : null}>
      <Container>
        <Circle $hasCircle={hasCircle}>{children}</Circle>
        {hasTick && (
          <TickCheckContainer>
            <CheckCircleIcon color="success" fontSize="inherit" />
          </TickCheckContainer>
        )}
      </Container>
    </Tooltip>
  );
};
