import { Slider, Stack } from '@mui/material';
import { t } from '../../../../services/intl';
import React from 'react';
import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';

export const MinimumRoutesFilter = () => {
  const { climbingFilter } = useUserSettingsContext();
  const { minimumRoutes, setMinimumRoutes } = climbingFilter;

  const onChange = (_event: Event, newValue: number) => {
    setMinimumRoutes(newValue);
  };

  return (
    <Stack gap={1} ml={2} mr={2} sx={{ paddingBottom: 2 }}>
      <div>
        {t('crag_filter.show_at_least')} <strong>{minimumRoutes}</strong>{' '}
        {t('crag_filter.routes')}
      </div>
      <Slider value={minimumRoutes} onChange={onChange} min={1} max={80} />
    </Stack>
  );
};
