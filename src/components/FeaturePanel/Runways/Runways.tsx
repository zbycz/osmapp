import React from 'react';
import { useQuery } from 'react-query';
import { Typography } from '@mui/material';
import { useFeatureContext } from '../../utils/FeatureContext';
import { loadRunways } from './loadRunways';
import { SuccessRunways } from './SuccessRunways';
import { DotLoader } from '../../helpers';

const RunwaysInner = () => {
  const { feature } = useFeatureContext();
  const { id } = feature.osmMeta;

  const { data, status } = useQuery('airport-runways', () => loadRunways(id));

  switch (status) {
    case 'success':
      return data.length > 0 && <SuccessRunways runways={data} />;
    case 'error':
      return (
        <Typography color="secondary" paragraph>
          Error
        </Typography>
      );
    default:
      return <DotLoader />;
  }
};

export const Runways = () => {
  const { feature } = useFeatureContext();
  const isAirport = feature.tags.aeroway === 'aerodrome';
  if (!isAirport) return null;

  return <RunwaysInner />;
};
