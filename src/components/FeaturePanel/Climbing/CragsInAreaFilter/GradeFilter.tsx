import { useUserSettingsContext } from '../../../utils/userSettings/UserSettingsContext';
import { Slider, Stack } from '@mui/material';
import { t } from '../../../../services/intl';
import { GradeSystemSelect } from '../GradeSystemSelect';
import { RouteDifficultyBadge } from '../RouteDifficultyBadge';
import React from 'react';

export const GradeFilter = ({
  uniqueValues,
  currentGradeSystem,
  gradeInterval,
  onChange,
}) => {
  const { userSettings, setUserSetting } = useUserSettingsContext();

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
        mr={2}
        ml={2}
        mt={1}
      >
        {t('crag_filter.grade')}
        <GradeSystemSelect
          setGradeSystem={(system) => {
            setUserSetting('climbing.gradeSystem', system);
          }}
          selectedGradeSystem={userSettings['climbing.gradeSystem']}
        />
      </Stack>
      <Stack gap={1} ml={2} mr={2} mb={2}>
        <div>
          {t('crag_filter.grade_from')}{' '}
          <RouteDifficultyBadge
            routeDifficulty={{
              gradeSystem: currentGradeSystem,
              grade: uniqueValues[gradeInterval[0]],
            }}
          />{' '}
          {uniqueValues[gradeInterval[1]] && (
            <>
              {t('crag_filter.grade_to')}{' '}
              <RouteDifficultyBadge
                routeDifficulty={{
                  gradeSystem: currentGradeSystem,
                  grade: uniqueValues[gradeInterval[1]],
                }}
              />
            </>
          )}
        </div>
        <Slider
          value={gradeInterval}
          onChange={onChange}
          min={0}
          max={uniqueValues.length - 1}
        />
      </Stack>
    </>
  );
};
