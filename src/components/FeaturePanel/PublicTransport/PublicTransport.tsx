import React from 'react';
import { PublicTransportInner } from './routes/Routes';
import { PublicTransportRoute } from './route/PublicTransportRoute';
import { useFeatureContext } from '../../utils/FeatureContext';
import { isPublictransportHalt, isPublictransportRoute } from '../../../utils';

export const PublicTransport = () => {
  const { feature } = useFeatureContext();

  if (isPublictransportHalt(feature)) {
    return <PublicTransportInner />;
  }

  if (isPublictransportRoute(feature)) {
    return <PublicTransportRoute />;
  }

  return null;
};
