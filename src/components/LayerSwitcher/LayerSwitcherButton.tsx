import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { t } from '../../services/intl';
import { useMobileMode } from '../helpers';
import { convertHexToRgba } from '../utils/colorUtils';
import { Typography, Tooltip } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';

const StyledLayerSwitcher = styled.button<{
  $isMobileMode: boolean;
  $isOpened: boolean;
}>`
  margin: 0;
  padding: 2px 20px 2px 16px;
  display: flex;
  gap: 8px;
  align-items: center;
  flex-direction: row;
  pointer-events: all;
  ${({ $isMobileMode }) =>
    $isMobileMode
      ? css`
          width: 44px;
          height: 44px;
          border-radius: 50%;
          padding: 0;
        `
      : css`
          border-radius: 40px;
        `}

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

export const LayerSwitcherButton = ({
  onClick,
  isOpened,
}: {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isOpened?: boolean;
}) => {
  const isMobileMode = useMobileMode();
  return (
    <Tooltip title={isMobileMode ? t('layerswitcher.button') : null} arrow>
      <StyledLayerSwitcher
        onClick={onClick}
        $isMobileMode={isMobileMode}
        $isOpened={isOpened}
      >
        <MapIcon />
        {!isMobileMode && (
          <Typography variant="button">{t('layerswitcher.button')}</Typography>
        )}
      </StyledLayerSwitcher>
    </Tooltip>
  );
};
