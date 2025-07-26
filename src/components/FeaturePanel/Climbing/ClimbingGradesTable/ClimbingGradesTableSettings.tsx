import { useUserSettingsContext } from '../../../utils/UserSettingsContext';
import { Alert, Box, Chip, Stack, Typography } from '@mui/material';
import { t } from '../../../../services/intl';
import { GRADE_SYSTEMS } from '../../../../services/tagging/climbing/gradeSystems';
import React from 'react';
import { useGradeSystemsStatus } from '../utils/useVisibleGradeSystems';

export const ClimbingGradesTableSettings = ({ isSettingVisible }) => {
  const gradeSystemsStatus = useGradeSystemsStatus();
  const isGradeSystemVisible = (key: string) => gradeSystemsStatus[key];
  const { setUserSetting } = useUserSettingsContext();

  return (
    isSettingVisible && (
      <Box m={1}>
        <Alert severity="warning">
          {t('climbing_grade_table.warning')}{' '}
          <a href="https://github.com/zbycz/osmapp/issues" target="_blank">
            Github
          </a>
          .
        </Alert>

        <Typography variant="body2" mt={3} ml={1}>
          {t('climbing_grade_table.show')}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={0.6} mt={1}>
          {GRADE_SYSTEMS.map((gs) => {
            const isVisible = isGradeSystemVisible(gs.key);
            return (
              <Chip
                key={`chip-${gs.key}`}
                label={`${gs.name} ${gs.flags ?? ''}`}
                variant={isVisible ? 'filled' : 'outlined'}
                onClick={() =>
                  setUserSetting('climbing.visibleGradeSystems', {
                    ...gradeSystemsStatus,
                    [gs.key]: !isVisible,
                  })
                }
              />
            );
          })}
        </Stack>
      </Box>
    )
  );
};
