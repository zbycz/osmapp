import styled from 'styled-components';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import React from 'react';
import { t } from '../../../services/intl';

const StyledIconButton = styled(IconButton)`
  position: absolute !important; /* TODO mui styles takes precendence, why? */
  right: 0;
  margin-top: -12px !important;
  display: none !important;

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }
`;

export const EditIconButton = ({ onClick }) => (
  <StyledIconButton className="show-on-hover" onClick={onClick}>
    <EditIcon titleAccess={t('featurepanel.inline_edit_title')} />
  </StyledIconButton>
);
