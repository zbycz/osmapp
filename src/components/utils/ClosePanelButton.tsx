import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { t } from '../../services/intl';

type ClosePanelButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  right?: boolean;
  style?: React.CSSProperties;
};

export const ClosePanelButton = ({
  onClick,
  right = false,
  style = {},
}: ClosePanelButtonProps) => (
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
