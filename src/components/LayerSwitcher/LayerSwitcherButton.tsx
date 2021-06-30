import React from 'react';
import styled from 'styled-components';
import LayersIcon from './LayersIcon';
import { t } from '../../services/intl';
import { isPanelFixedWidth } from '../helpers';

const TopRight = styled.div`
  position: absolute;
  z-index: 1000;
  padding: 10px;
  right: 0;
  bottom: 20px;

  @media ${isPanelFixedWidth} {
    top: 0;
    bottom: auto;
  }
`;

const StyledLayerSwitcher = styled.button`
  margin: 0;
  padding: 0;
  width: 52px;
  height: 69px;
  border-radius: 5px;
  border: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.8);
  outline: 0;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: #f2f3f2;
  }

  svg {
    margin: 4px auto 4px auto;
  }
`;

export const LayerSwitcherButton = ({ onClick }: { onClick?: any }) => (
  <TopRight>
    <StyledLayerSwitcher onClick={onClick}>
      <LayersIcon />
      {t('layerswitcher.button')}
    </StyledLayerSwitcher>
  </TopRight>
);
