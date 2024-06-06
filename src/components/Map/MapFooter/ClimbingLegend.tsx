import React from 'react';
import styled from 'styled-components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Tooltip, IconButton } from '@mui/material';
import { useMapStateContext } from '../../utils/MapStateContext';
import { COLORS } from '../styles/layers/climbingLayers';
import { useIsClient } from '../../helpers';
import { convertHexToRgba } from '../../utils/colorUtils';

const HideableContainer = styled.div<{ isVisible: boolean }>`
  transition: max-height 0.15s ease-out;
  max-height: ${({ isVisible }) => (isVisible ? 500 : 0)}px;
  overflow: hidden;
`;

const Container = styled.div`
  border-bottom: solid 1px
    ${({ theme }) => convertHexToRgba(theme.palette.text.primary, 0.4)};
  margin-bottom: 6px;
  padding-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

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

export const ClimbingLegend = ({ isLegendVisible, setIsLegendVisible }) => {
  const isClient = useIsClient();
  const { activeLayers } = useMapStateContext();

  const isClimbingLayerVisible = activeLayers.includes('climbing');

  const onLegendClose = () => {
    setIsLegendVisible(false);
  };

  const isVisible = isLegendVisible && isClimbingLayerVisible && isClient;
  return (
    <HideableContainer isVisible={isVisible}>
      <Container>
        <HeadingRow>
          <Heading>Climbing legend</Heading>
          <Tooltip title="Hide climbing legend" enterDelay={1000}>
            <IconButton
              size="small"
              edge="end"
              aria-label="close"
              onClick={onLegendClose}
            >
              <KeyboardArrowDownIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
    </HideableContainer>
  );
};
