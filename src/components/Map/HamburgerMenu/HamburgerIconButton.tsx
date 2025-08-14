import { IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import styled from '@emotion/styled';
import { t } from '../../../services/intl';
import { LoginIconButton } from './LoginIconButton';
import { useOsmAuthContext } from '../../utils/OsmAuthContext';
import { useMobileMode } from '../../helpers';
import { convertHexToRgba } from '../../utils/colorUtils';

const Container = styled.div<{ $isMobileMode?: boolean }>`
  border-radius: 32px;
  ${({ $isMobileMode, theme }) =>
    $isMobileMode
      ? ''
      : `
  background: ${convertHexToRgba(theme.palette.background.paper, 0.7)};
  &:hover {
    background: ${theme.palette.background.paper};
  }
  `}
`;

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $isLoggedIn: boolean }>`
  ${({ $isLoggedIn }) => ($isLoggedIn ? 'padding: 3px;' : '')}
  svg {
    fill: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const HamburgerIconButton = ({ anchorRef, onClick }) => {
  const { osmUser } = useOsmAuthContext();
  const isMobileMode = useMobileMode();
  return (
    <Container $isMobileMode={isMobileMode}>
      <Tooltip title={t('map.more_button_title')}>
        <StyledIconButton
          ref={anchorRef}
          color="primary"
          aria-controls="hamburger-menu"
          aria-haspopup="true"
          onClick={onClick}
          $isLoggedIn={!!osmUser}
        >
          {osmUser ? <LoginIconButton size={32} /> : <MenuIcon />}
        </StyledIconButton>
      </Tooltip>
    </Container>
  );
};
