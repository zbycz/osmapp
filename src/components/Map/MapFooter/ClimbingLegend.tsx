import React from 'react';
import styled from 'styled-components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IconButton, Tooltip } from '@mui/material';
import { convertHexToRgba } from '../../utils/colorUtils';

export const CLIMBING_LEGEND = {
  AREA: {
    HAS_IMAGES: {
      HOVER: {
        IMAGE: 'climbing:area-blue',
        COLOR: 'rgba(0, 59, 210, 0.7)',
      },
      DEFAULT: {
        IMAGE: 'climbing:area-blue',
        COLOR: 'rgba(0, 59, 210, 1)',
      },
    },
    NO_IMAGES: {
      HOVER: {
        IMAGE: 'climbing:area-gray',
        COLOR: 'black',
      },
      DEFAULT: {
        IMAGE: 'climbing:area-gray',
        COLOR: '#666',
      },
    },
  },
  CRAG: {
    HAS_IMAGES: {
      HOVER: {
        IMAGE: 'climbing:crag-red',
        COLOR: 'rgba(234, 85, 64, 0.7)',
      },
      DEFAULT: {
        IMAGE: 'climbing:crag-red',
        COLOR: '#ea5540',
      },
    },
    NO_IMAGES: {
      HOVER: {
        IMAGE: 'climbing:crag-gray',
        COLOR: 'black',
      },
      DEFAULT: {
        IMAGE: 'climbing:crag-gray',
        COLOR: '#666',
      },
    },
  },
};

const HideableContainer = styled.div<{ $isVisible: boolean }>`
  transition: max-height 0.15s ease-out;
  max-height: ${({ $isVisible }) => ($isVisible ? 500 : 0)}px;
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

export const ClimbingLegend = ({ isVisible, setLegendShown }) => {
  const onLegendClose = () => {
    setLegendShown(false);
  };

  return (
    <HideableContainer $isVisible={isVisible}>
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
          <Dot color={CLIMBING_LEGEND.AREA.HAS_IMAGES.DEFAULT.COLOR} />
          Area with photos
        </Item>
        <Item>
          <Dot color={CLIMBING_LEGEND.CRAG.HAS_IMAGES.DEFAULT.COLOR} />
          Crag with photos
        </Item>
        <Item>
          <Dot color={CLIMBING_LEGEND.AREA.NO_IMAGES.DEFAULT.COLOR} />
          Area/crag without photos
        </Item>
      </Container>
    </HideableContainer>
  );
};
