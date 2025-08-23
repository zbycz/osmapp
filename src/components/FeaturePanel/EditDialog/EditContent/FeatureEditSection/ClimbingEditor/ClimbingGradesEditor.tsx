import { extractClimbingGradeFromTagName } from '../../../../../../services/tagging/climbing/routeGrade';
import { GradeSelect } from '../GradeSelect';
import React from 'react';
import { useUserSettingsContext } from '../../../../../utils/userSettings/UserSettingsContext';
import { useCurrentItem } from '../../../EditContext';
import { GradeSystemSelect } from '../../../../Climbing/GradeSystemSelect';
import { Box, Stack, Typography } from '@mui/material';
import { t } from '../../../../../../services/intl';
import { isClimbingRoute } from '../../../../../../utils';

export const ClimbingGradesEditor = () => {
  const { tags } = useCurrentItem();
  const { userSettings } = useUserSettingsContext();
  const currentGradeSystem = userSettings['climbing.gradeSystem'] ?? 'uiaa';

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
        <GradeSystemSelect allowUnsetValue={false} />
      </Stack>
    </Box>
  );
};
