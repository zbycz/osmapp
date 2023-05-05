import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { t } from '../../services/intl';

export const ClosePanelButton = ({ onClick, right = false, style = {} }) => (
  <IconButton
    aria-label={t('close_panel')}
    onClick={onClick}
    style={{
      ...(right ? { position: 'fixed', right: 12 } : {}),
      ...style,
    }}
  >
    <CloseIcon />
  </IconButton>
);
