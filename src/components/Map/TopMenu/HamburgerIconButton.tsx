import { IconButton } from '@mui/material';
import { t } from '../../../services/intl';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import styled from 'styled-components';

const StyledIconButton = styled(IconButton)`
  padding: 12px;
  margin-left: -10px;
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
