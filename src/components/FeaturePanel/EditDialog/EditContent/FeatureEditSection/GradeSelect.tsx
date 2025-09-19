import { Box } from '@mui/material';
import React from 'react';
import { GRADE_TABLE } from '../../../../../services/tagging/climbing/gradeData';
import { RouteDifficultyBadge } from '../../../Climbing/RouteDifficultyBadge';
import { AutocompleteSelect } from './AutocompleteSelect';
import { FeatureTags } from '../../../../../services/types';
import { useCurrentItem } from '../../context/EditContext';
import { getGradeSystemName } from '../../../../../services/tagging/climbing/gradeSystems';

type GradeSelectProps = {
  k: string;
  climbingGradeSystem: string;
  tags: FeatureTags;
};

export const GradeSelect = ({
  k,
  climbingGradeSystem,
  tags,
}: GradeSelectProps) => {
  const values = GRADE_TABLE[climbingGradeSystem];
  const uniqueValues = [...new Set(values)];
  const currentValue = tags[k] ?? '';
  const { setTag } = useCurrentItem();

  const onChange = (_e: React.SyntheticEvent, option: string | null) => {
    setTag(k, option ?? '');
  };

  return (
    <AutocompleteSelect
      values={uniqueValues}
      label={getGradeSystemName(climbingGradeSystem)}
      value={currentValue || null}
      onChange={onChange}
      freeSolo
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <RouteDifficultyBadge
            routeDifficulty={{
              gradeSystem: climbingGradeSystem,
              grade: typeof option === 'string' ? option : option.label,
            }}
          />
        </Box>
      )}
    />
  );
};
