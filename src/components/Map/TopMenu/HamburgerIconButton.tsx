import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import styled from 'styled-components';
import { t } from '../../../services/intl';
import { isMobileMode } from '../../helpers';

const StyledIconButton = styled(IconButton)`
  padding: 12px;
  margin-left: -10px;

  svg {
    filter: drop-shadow(0 0 2px #ffffff);
    @media ${isMobileMode} {
      filter: invert(100%);
    }
  }
`;

export const HamburgerIconButton = ({ anchorRef, onClick }) => (
  <StyledIconButton
    ref={anchorRef}
    aria-controls="hamburger-menu"
    aria-haspopup="true"
    title={t('map.more_button_title')}
    color="secondary"
    onClick={onClick}
  >
    <MenuIcon />
  </StyledIconButton>
);
