import React from 'react';
import { Box, Alert } from '@mui/material';
import { t } from '../../services/intl';
import { getUrlOsmId } from '../../services/helpers';
import { useFeatureContext } from '../utils/FeatureContext';
import { OSM_WEBSITE } from '../../services/osm/consts';

export const OsmError = () => {
  const { feature } = useFeatureContext();
  const code = feature.error;

  if (feature.deleted) {
    const historyUrl = `${OSM_WEBSITE}/${getUrlOsmId(feature.osmMeta)}/history`;
    return (
      <Box mb={3}>
        <Alert variant="outlined" severity="warning">
          {t('featurepanel.error_deleted')}{' '}
          <a href={historyUrl} target="_blank">
            {t('featurepanel.history_button')}
          </a>
        </Alert>
      </Box>
    );
  }

  if (code === 'unknown') {
    return (
      <Alert variant="outlined" severity="warning" sx={{ mb: 2 }}>
        {t('featurepanel.error_unknown')}
      </Alert>
    );
  }

  if (code === 'network') {
    return (
      <Alert variant="outlined" severity="warning" sx={{ mb: 2 }}>
        {t('featurepanel.error_network')}
      </Alert>
    );
  }

  if (code) {
    return (
      <Alert variant="outlined" severity="warning" sx={{ mb: 2 }}>
        {t('featurepanel.error', { code })}
      </Alert>
    );
  }

  if (
    Object.keys(feature.tags).length === 0 &&
    !feature.point &&
    !feature.skeleton
  ) {
    return (
      <Alert variant="outlined" severity="info" sx={{ mb: 2 }}>
        {t('featurepanel.info_no_tags')}
      </Alert>
    );
  }

  return null;
};
