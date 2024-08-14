import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { LineInformation, requestLines } from './requestRoutes';
import { PublicTransportWrapper } from './PublicTransportWrapper';
import { FeatureTags } from '../../../services/types';
import { LineNumber } from './LineNumber';
import { DotLoader } from '../../helpers';

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

const PublicTransportInner = () => {
  const router = useRouter();

  const { routes, error, loading, startRoutes, finishRoutes, failRoutes } =
    useLoadingState();

  useEffect(() => {
    (async () => {
      startRoutes();
      const lines = await requestLines(
        router.query.all[0] as any,
        Number(router.query.all[1]),
      ).catch(failRoutes);
      finishRoutes(lines);
    })();
  }, [failRoutes, finishRoutes, router.query.all, startRoutes]);

  return (
    <div>
      {loading ? (
        <DotLoader />
      ) : (
        <PublicTransportWrapper>
          {routes.map((line) => (
            <LineNumber key={line.ref} name={line.ref} color={line.colour} />
          ))}
        </PublicTransportWrapper>
      )}
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
