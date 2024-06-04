import React from 'react';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useMapStateContext } from '../../utils/MapStateContext';
import { COLORS } from '../styles/layers/climbingLayers';
import { usePersistedState } from '../../utils/usePersistedState';
import { useIsClient } from '../../helpers';

const Dot = styled.div<{ color: string }>`
  border-radius: 50%;
  width: 15px;
  height: 15px;
  border: solid 2px white;
  background: ${({ color }) => color};
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
`;
const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
`;

const HeadingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Heading = styled.div`
  font-size: 12px;
  font-weight: bold;
`;

const Container = styled.div`
  margin: 4px;
  pointer-events: all;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  color: ${({ theme }) => theme.palette.text.primary};
  background-color: ${({ theme }) => theme.palette.background.paper};
`;

export const ClimbingLegend = () => {
  const [isLegendVisible, setIsLegendVisible] = usePersistedState<boolean>(
    'isLegendVisible',
    true,
  );
  const isClient = useIsClient();
  const { activeLayers } = useMapStateContext();

  const isClimbingLayerVisible = activeLayers.includes('climbing');

  const onLegendClose = () => {
    setIsLegendVisible(false);
  };

  return isLegendVisible && isClimbingLayerVisible && isClient ? (
    <Container>
      <HeadingRow>
        <Heading>Climbing legend</Heading>
        <IconButton
          size="small"
          edge="end"
          aria-label="close"
          onClick={onLegendClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </HeadingRow>
      <Item>
        <Dot color={COLORS.AREA.HAS_IMAGES.DEFAULT} />
        Area with photos
      </Item>
      <Item>
        <Dot color={COLORS.CRAG.HAS_IMAGES.DEFAULT} />
        Crag with photos
      </Item>
      <Item>
        <Dot color={COLORS.AREA.NO_IMAGES.DEFAULT} />
        Area/crag without photos
      </Item>
    </Container>
  ) : null;
};
