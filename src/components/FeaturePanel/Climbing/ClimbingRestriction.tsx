import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { useFeatureContext } from '../../utils/FeatureContext';
import { t } from '../../../services/intl';

export const ClimbingRestriction = () => {
  const { feature } = useFeatureContext();

  if (!feature.tags.climbing) {
    return null;
  }

  const restriction = feature.tags['climbing:restriction'];
  const restrictionTimeDescription =
    feature.tags['climbing:restriction:time_description'];

  if (!restriction && !restrictionTimeDescription) {
    return null;
  }

  return (
    <Alert
      severity={restriction === 'yes' ? 'error' : 'warning'}
      sx={{ mt: 2 }}
    >
      <AlertTitle>{t('featurepanel.climbing_restriction')}</AlertTitle>
      {restrictionTimeDescription}
    </Alert>
  );
};
