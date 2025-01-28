import { useFeatureContext } from '../utils/FeatureContext';
import { isFeatureClimbingRoute } from '../../utils';
import { getDifficulties } from './Climbing/utils/grades/routeGrade';
import { ConvertedRouteDifficultyBadge } from './Climbing/ConvertedRouteDifficultyBadge';
import React from 'react';

export const ClimbingRouteGrade = () => {
  const { feature } = useFeatureContext();
  if (!isFeatureClimbingRoute(feature)) {
    return null;
  }

  const routeDifficulties = getDifficulties(feature?.tags);

  return (
    <ConvertedRouteDifficultyBadge routeDifficulties={routeDifficulties} />
  );
};
