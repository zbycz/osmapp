import React from 'react';
import styled from '@emotion/styled';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IconButton, Tooltip } from '@mui/material';
import { convertHexToRgba } from '../../utils/colorUtils';
import AreaBlue from '../../../../public/icons-climbing/icons/area-blue.svg';
import CragRed from '../../../../public/icons-climbing/icons/crag-red.svg';
import AreaGray from '../../../../public/icons-climbing/icons/area-gray.svg';
import CragGray from '../../../../public/icons-climbing/icons/crag-gray.svg';
import { t } from '../../../services/intl';

const HideableContainer = styled.div<{ $isVisible: boolean }>`
  transition: max-height 0.15s ease-out;
  max-height: ${({ $isVisible }) => ($isVisible ? 500 : 0)}px;
  overflow: hidden;

  pointer-events: all;
  border-radius: 8px;
  padding: ${({ $isVisible }) => ($isVisible ? '0px 4px 2px 4px' : '0 6px')};
  color: ${({ theme }) => theme.palette.text.primary};
  background-color: ${({ theme }) =>
    convertHexToRgba(theme.palette.background.paper, 0.5)};
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
`;

const Icon = styled.img`
  height: 16px;
  font-size: 14px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  margin-left: 2px;
`;

const ItemFaded = styled(Item)`
  margin-top: -2px;

  img {
    opacity: 0.5;
  }
`;

const HeadingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
`;

const Heading = styled.div`
  font-size: 12px;
  font-weight: bold;
`;

const CloseButtonWrapper = styled.div``;

const CloseButton = (props: { onClick: () => void }) => (
  <CloseButtonWrapper>
    <Tooltip title="Hide climbing legend" enterDelay={1000}>
      <IconButton
        size="small"
        edge="end"
        aria-label="close"
        onClick={props.onClick}
      >
        <KeyboardArrowDownIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </CloseButtonWrapper>
);

export const ClimbingLegend = ({ isVisible, setLegendShown }) => {
  const onLegendClose = () => {
    setLegendShown(false);
  };

  return (
    <HideableContainer $isVisible={isVisible}>
      <Container>
        <HeadingRow>
          <Heading>{t('climbing_legend.areas_crags')}</Heading>
          <CloseButton onClick={onLegendClose} />
        </HeadingRow>
        <Item>
          <span>
            <Icon src={AreaBlue.src} alt="Climbing area with photos icon" />
            <Icon src={CragRed.src} alt="Climbing crag with photos icon" />
          </span>
          {t('climbing_legend.topos')}
        </Item>
        <ItemFaded>
          <span>
            <Icon src={AreaGray.src} alt="Climbing area without photos icon" />
            <Icon src={CragGray.src} alt="Climbing crag without photos icon" />
          </span>
          {t('climbing_legend.only_position')}
        </ItemFaded>
      </Container>
    </HideableContainer>
  );
};
