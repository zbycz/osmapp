import { Box } from '@mui/material';
import React from 'react';
import { GRADE_TABLE } from '../../../../../services/tagging/climbing/gradeData';
import { RouteDifficultyBadge } from '../../../Climbing/RouteDifficultyBadge';
import { AutocompleteSelect } from './AutocompleteSelect';
import { FeatureTags } from '../../../../../services/types';
import { useCurrentItem } from '../../EditContext';

type GradeSelectProps = {
  data: { keys: string[]; names: any };
  k: string;
  climbingGradeSystem: string;
  tags: FeatureTags;
};
export const GradeSelect = ({
  data: { names },
  k,
  climbingGradeSystem,
  tags,
}: GradeSelectProps) => {
  const values = GRADE_TABLE[climbingGradeSystem];
  const uniqueValues = [...new Set(values)];
  const value = tags[k] ?? '';
  const { setTag } = useCurrentItem();

  const onChange = (_e, option) => {
    setTag(k, option);
  };

  return (
    <AutocompleteSelect
      values={uniqueValues}
      label={names[k]}
      defaultValue={value}
      onChange={onChange}
      renderOption={(props, option, _state, ownerState) => {
        const { key, ...optionProps } = props;
        return (
          <Box key={key} {...optionProps}>
            <RouteDifficultyBadge
              routeDifficulty={{
                gradeSystem: climbingGradeSystem,
                grade: ownerState.getOptionLabel(option),
              }}
            />
          </Box>
        );
      }}
    />
  );
};
