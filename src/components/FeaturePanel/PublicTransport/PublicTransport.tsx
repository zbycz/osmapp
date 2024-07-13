import React, { useEffect } from 'react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { Typography } from '@mui/material';
import { LineInformation, requestLines } from './requestRoutes';
import { PublicTransportCategory } from './PublicTransportWrapper';
import { FeatureTags } from '../../../services/types';
import { DotLoader } from '../../helpers';
import { sortBy } from './helpers';
import { useFeatureContext } from '../../utils/FeatureContext';
import { getGlobalMap } from '../../../services/mapStorage';

interface PublicTransportProps {
  tags: FeatureTags;
}

const categories = [
  'tourism',
  'commuter',
  'regional',
  'long_distance',
  'high_speed',
  'night',
  'car',
  'car_shuttle',
  'unknown',
];

const PublicTransportDisplay = ({ routes }) => {
  const grouped = _.groupBy(routes, ({ service }) => {
    const base = service?.split(';')[0];
    return categories.includes(base) ? base : 'unknown';
  });
  const entries = Object.entries(grouped) as [string, LineInformation[]][];
  const sorted = sortBy(entries, categories, ([category]) => category);

  return (
    <>
      {sorted.map(([category, lines]) => (
        <PublicTransportCategory
          category={category}
          lines={lines}
          amountOfCategories={entries.length}
        />
      ))}
    </>
  );
};

const PublicTransportInner = () => {
  const { feature } = useFeatureContext();
  const { id, type } = feature.osmMeta;

  const { data, status } = useQuery('publictransport', () =>
    requestLines(type, Number(id)),
  );

  useEffect(() => {
    if (!data) return;

    getGlobalMap()?.getSource('overpass')?.setData(data.geoJson);
  }, [data]);

  return (
    <div>
      {status === 'loading' || (status === 'idle' && <DotLoader />)}
      {status === 'success' && <PublicTransportDisplay routes={data.routes} />}
      {status === 'error' && (
        <Typography color="secondary" paragraph>
          Error
        </Typography>
      )}
    </div>
  );
};

export const PublicTransport: React.FC<PublicTransportProps> = ({ tags }) => {
  const isPublicTransport =
    Object.keys(tags).includes('public_transport') ||
    tags.railway === 'station' ||
    tags.railway === 'halt';

  if (!isPublicTransport) {
    return null;
  }

  return PublicTransportInner();
};
