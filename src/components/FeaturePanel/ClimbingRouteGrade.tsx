import { useFeatureContext } from '../utils/FeatureContext';
import { isFeatureClimbingRoute } from '../../utils';
import { getDifficulties } from '../../services/tagging/climbing/routeGrade';
import { ConvertedRouteDifficultyBadge } from './Climbing/ConvertedRouteDifficultyBadge';
import React from 'react';
import { GradeSystemSelect } from './Climbing/GradeSystemSelect';
import { Stack } from '@mui/material';

export const ClimbingRouteGrade = () => {
  const { feature } = useFeatureContext();
  if (!isFeatureClimbingRoute(feature)) {
    return null;
  }

  const routeDifficulties = getDifficulties(feature?.tags);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <ConvertedRouteDifficultyBadge routeDifficulties={routeDifficulties} />
      <GradeSystemSelect />
    </Stack>
  );
};
