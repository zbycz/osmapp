import React from 'react';
import { PublicTransportInner } from './routes/Routes';
import { PublicTransportRoute } from './route/PublicTransportRoute';
import { useFeatureContext } from '../../utils/FeatureContext';
import { isPublictransportStop, isPublictransportRoute } from '../../../utils';

export const PublicTransport = () => {
  const { feature } = useFeatureContext();

  if (isPublictransportStop(feature)) {
    return <PublicTransportInner />;
  }

  if (isPublictransportRoute(feature)) {
    return <PublicTransportRoute />;
  }

  return null;
};
