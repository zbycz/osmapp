import React from 'react';
import styled from '@emotion/styled';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IconButton, Stack, Tooltip } from '@mui/material';
import AreaBlue from '../../../../public/icons-climbing/icons/area-blue.svg';
import CragRed from '../../../../public/icons-climbing/icons/crag-red.svg';
import AreaGray from '../../../../public/icons-climbing/icons/area-gray.svg';
import CragGray from '../../../../public/icons-climbing/icons/crag-gray.svg';
import { t } from '../../../services/intl';

const HideableContainer = styled.div<{ $isVisible: boolean }>`
  transition: max-height 0.15s ease-out;
  max-height: ${({ $isVisible }) => ($isVisible ? 500 : 0)}px;
  overflow: hidden;
`;

const Icon = styled.img`
  height: 16px;
  font-size: 14px;
`;

const Container = styled.div`
  pointer-events: all;
  border-radius: 8px;
  padding: 0 4px 2px 4px;
  color: rgba(0, 0, 0, 0.8);
  background-color: rgba(250, 250, 250, 0.5);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  margin-top: 4px;
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
        color="inherit"
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
        <Stack direction="column">
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
              <Icon
                src={AreaGray.src}
                alt="Climbing area without photos icon"
              />
              <Icon
                src={CragGray.src}
                alt="Climbing crag without photos icon"
              />
            </span>
            {t('climbing_legend.only_position')}
          </ItemFaded>
        </Stack>
      </Container>
    </HideableContainer>
  );
};
