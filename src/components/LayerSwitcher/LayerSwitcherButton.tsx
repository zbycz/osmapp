import React from 'react';
import styled from '@emotion/styled';

import { t } from '../../services/intl';
import { isWideResolution } from '../helpers';
import { convertHexToRgba } from '../utils/colorUtils';
import { Typography, Tooltip, useMediaQuery } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';

const StyledLayerSwitcher = styled.button<{
  $isOpened: boolean;
}>`
  margin: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  pointer-events: all;

  @media ${isWideResolution} {
    width: auto;
    height: 40px;
    border-radius: 40px;
    padding: 0 20px 0 16px;
  }

  border: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  background-color: ${({ theme, $isOpened }) =>
    $isOpened
      ? theme.palette.background.paper
      : convertHexToRgba(theme.palette.background.paper, 0.8)};
  backdrop-filter: blur(15px);
  font-size: 12px;
  color: ${({ theme }) => theme.palette.text.primary};
  outline: 0;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme, $isOpened }) =>
      theme.palette.background.paper};
  }

  svg {
    margin: 4px auto 4px auto;
  }
`;

const Label = styled(Typography)`
  display: none;

  @media ${isWideResolution} {
    display: inline-block;
  }
`;

export const LayerSwitcherButton = ({
  onClick,
  isOpened,
}: {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isOpened?: boolean;
}) => {
  const isWide = useMediaQuery(isWideResolution);

  return (
    <Tooltip title={isWide ? null : t('layerswitcher.button')} arrow>
      <StyledLayerSwitcher onClick={onClick} $isOpened={isOpened}>
        <MapIcon />
        <Label variant="button">{t('layerswitcher.button')}</Label>
      </StyledLayerSwitcher>
    </Tooltip>
  );
};
