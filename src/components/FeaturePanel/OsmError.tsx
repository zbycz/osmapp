import React from 'react';
import { Alert } from '@mui/lab';
import { Box } from '@mui/material';
import { t } from '../../services/intl';
import { getUrlOsmId } from '../../services/helpers';
import { useFeatureContext } from '../utils/FeatureContext';

export const OsmError = () => {
  const { feature } = useFeatureContext();
  const code = feature.error;

  if (feature.deleted) {
    return (
      <Box mb={3} clone>
        <Alert variant="outlined" severity="warning">
          {t('featurepanel.error_deleted')}{' '}
          <a
            href={`https://openstreetmap.org/${getUrlOsmId(
              feature.osmMeta,
            )}/history`}
            target="_blank"
            rel="noopener"
          >
            {t('featurepanel.history_button')}
          </a>
        </Alert>
      </Box>
    );
  }

  if (code === 'unknown') {
    return (
      <Alert variant="outlined" severity="warning">
        {t('featurepanel.error_unknown')}
      </Alert>
    );
  }

  if (code === 'network') {
    return (
      <Alert variant="outlined" severity="warning">
        {t('featurepanel.error_network')}
      </Alert>
    );
  }

  if (code) {
    return (
      <Alert variant="outlined" severity="warning">
        {t('featurepanel.error', { code })}
      </Alert>
    );
  }

  if (Object.keys(feature.tags).length === 0 && !feature.point) {
    return (
      <Alert variant="outlined" severity="info">
        {t('featurepanel.info_no_tags')}
      </Alert>
    );
  }

  return null;
};
