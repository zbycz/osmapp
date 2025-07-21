import { Slider, Stack } from '@mui/material';
import { t } from '../../../../services/intl';
import React from 'react';

export const MinimumRoutesFilter = ({ minimumRoutesInInterval, onChange }) => {
  return (
    <Stack gap={1} ml={2} mr={2} mb={2}>
      <div>
        {t('crag_filter.show_at_least')}{' '}
        <strong>{minimumRoutesInInterval}</strong> {t('crag_filter.routes')}
      </div>
      <Slider
        value={minimumRoutesInInterval}
        onChange={onChange}
        min={1}
        max={80}
      />
    </Stack>
  );
};
