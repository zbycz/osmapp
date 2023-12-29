import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { t } from '../../services/intl';

export const ClosePanelButton = ({ onClick, right = false, style = {} }) => (
  <IconButton
    aria-label={t('close_panel')}
    onClick={onClick}
    style={{
      ...(right ? { position: 'absolute', right: 0 } : {}),
      ...style,
    }}
  >
    <CloseIcon />
  </IconButton>
);
