import { useFeatureContext } from '../utils/FeatureContext';
import { isFeatureClimbingRoute } from '../../utils';
import { getDifficulties } from './Climbing/utils/grades/routeGrade';
import { ConvertedRouteDifficultyBadge } from './Climbing/ConvertedRouteDifficultyBadge';
import React from 'react';
import { useUserSettingsContext } from '../utils/UserSettingsContext';
import { GradeSystemSelect } from './Climbing/GradeSystemSelect';
import { Stack } from '@mui/material';

export const ClimbingRouteGrade = () => {
  const { feature } = useFeatureContext();
  const { userSettings, setUserSetting } = useUserSettingsContext();
  if (!isFeatureClimbingRoute(feature)) {
    return null;
  }

  const routeDifficulties = getDifficulties(feature?.tags);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <ConvertedRouteDifficultyBadge routeDifficulties={routeDifficulties} />
      <GradeSystemSelect
        setGradeSystem={(system) => {
          setUserSetting('climbing.gradeSystem', system);
        }}
        selectedGradeSystem={userSettings['climbing.gradeSystem']}
      />
    </Stack>
  );
};
