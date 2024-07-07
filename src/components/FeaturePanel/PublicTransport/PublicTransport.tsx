import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { LineInformation, requestLines } from './requestRoutes';
import { PublicTransportCategory } from './PublicTransportWrapper';
import { FeatureTags } from '../../../services/types';
import { DotLoader } from '../../helpers';
import { sortBy } from './helpers';

interface PublicTransportProps {
  tags: FeatureTags;
}

const useLoadingState = () => {
  const [routes, setRoutes] = useState<LineInformation[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  const finishRoutes = (payload) => {
    setLoading(false);
    setRoutes(payload);
  };

  const startRoutes = () => {
    setLoading(true);
    setRoutes([]);
    setError(undefined);
  };

  const failRoutes = () => {
    setError('Could not load routes');
    setLoading(false);
  };

  return { routes, error, loading, startRoutes, finishRoutes, failRoutes };
};

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
  const router = useRouter();

  const { routes, error, loading, startRoutes, finishRoutes, failRoutes } =
    useLoadingState();

  useEffect(() => {
    const loadData = async () => {
      startRoutes();
      const lines = await requestLines(
        router.query.all[0] as any,
        Number(router.query.all[1]),
      ).catch(failRoutes);
      finishRoutes(lines);
    };

    loadData();
  }, []);

  return (
    <div>
      {loading ? <DotLoader /> : <PublicTransportDisplay routes={routes} />}
      {error && (
        <Typography color="secondary" paragraph>
          Error: {error}
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
