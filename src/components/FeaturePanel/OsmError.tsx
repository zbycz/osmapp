import React from 'react';
import { Alert } from '@material-ui/lab';
import { t } from '../../services/intl';
import { getUrlOsmId } from '../../services/helpers';
import { useFeatureContext } from '../utils/FeatureContext';

export const OsmError = () => {
  const { feature } = useFeatureContext();
  const code = feature.error;

  if (code === 'gone') {
    return (
      <Alert variant="outlined" severity="warning">
        {t('featurepanel.error_gone')}{' '}
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

  return null;
};
