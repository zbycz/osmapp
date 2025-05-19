import { IconButton } from '@mui/material';
import DirectionsIcon from '@mui/icons-material/Directions';
import React from 'react';
import Link from 'next/link';
import { t } from '../../services/intl';

export const DirectionsButton = () => {
  return (
    <IconButton
      component={Link}
      href="/directions"
      title={t('featurepanel.directions_button')}
      aria-label={t('featurepanel.directions_button')}
    >
      <DirectionsIcon />
    </IconButton>
  );
};
