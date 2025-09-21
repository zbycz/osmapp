import { extractClimbingGradeFromTagName } from '../../../../../../services/tagging/climbing/routeGrade';
import { GradeSelect } from '../GradeSelect';
import React from 'react';
import { useUserSettingsContext } from '../../../../../utils/userSettings/UserSettingsContext';
import { useCurrentItem } from '../../../context/EditContext';
import { GradeSystemSelect } from '../../../../Climbing/GradeSystemSelect';
import { Box, Stack, Typography } from '@mui/material';
import { t } from '../../../../../../services/intl';
import { isClimbingRoute } from '../../../../../../utils';
import {
  DEFAULT_GRADE_SYSTEM,
  getGradeSystemName,
} from '../../../../../../services/tagging/climbing/gradeSystems';

export const ClimbingGradesEditor = () => {
  const { tags } = useCurrentItem();
  const { userSettings } = useUserSettingsContext();
  const currentGradeSystem =
    userSettings['climbing.gradeSystem'] ?? DEFAULT_GRADE_SYSTEM;

  const key = `climbing:grade:${currentGradeSystem}`;
  const climbingGradeSystem = extractClimbingGradeFromTagName(key);
  const isRoute = isClimbingRoute(tags);

  if (!isRoute) return null;

  return (
    <Box mb={2}>
      <Typography mb={1}>{t('tags.climbing_grade')}</Typography>
      <Stack gap={1} alignItems="center" direction="row">
        <Box flex="1">
          <GradeSelect
            k={key}
            climbingGradeSystem={climbingGradeSystem}
            tags={tags}
          />
        </Box>
        <GradeSystemSelect
          allowUnsetValue={false}
          defaultLabel={getGradeSystemName(DEFAULT_GRADE_SYSTEM)}
        />
      </Stack>
    </Box>
  );
};
