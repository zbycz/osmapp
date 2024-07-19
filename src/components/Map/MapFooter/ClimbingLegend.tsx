import React from 'react';
import styled from 'styled-components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IconButton, Tooltip } from '@mui/material';
import { convertHexToRgba } from '../../utils/colorUtils';
import AreaBlue from '../../../../public/icons-climbing/icons/area-blue.svg';
import CragRed from '../../../../public/icons-climbing/icons/crag-red.svg';
import AreaGray from '../../../../public/icons-climbing/icons/area-gray.svg';
import CragGray from '../../../../public/icons-climbing/icons/crag-gray.svg';

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

const Icon = styled.img`
  height: 18px;
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

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
          <Icon src={AreaBlue.src} alt="Climbing area with photos icon" />
          Area with photos
        </Item>
        <Item>
          <Icon src={AreaGray.src} alt="Climbing area without photos icon" />
          Area without photos
        </Item>
        <Item>
          <Icon src={CragRed.src} alt="Climbing crag with photos icon" />
          Crag with photos
        </Item>
        <Item>
          <Icon src={CragGray.src} alt="Climbing crag without photos icon" />
          Crag without photos
        </Item>
      </Container>
    </HideableContainer>
  );
};
