import React from 'react';
import { Feature } from '../../../services/types';
import styled from '@emotion/styled';
import { Chip, Stack } from '@mui/material';

const StyledChip = styled(Chip)`
  font-size: 10px;
  font-weight: 600;
  height: 14px;
  padding: 0;
  > span {
    padding: 4px;
  }
`;

type Props = {
  feature: Feature;
};

const types = [
  { label: 'boulder', value: 'climbing:boulder' },
  { label: 'trad', value: 'climbing:trad' },
  { label: 'speed', value: 'climbing:speed' },
  { label: 'sport', value: 'climbing:sport' },
  { label: 'multipitch', value: 'climbing:multipitch' },
  { label: 'ice', value: 'climbing:ice' },
  { label: 'mixed', value: 'climbing:mixed' },
  { label: 'deepwater', value: 'climbing:deepwater' },
  { label: 'top rope', value: 'climbing:toprope' },
];

export const ClimbingTypeBadge = ({ feature }: Props) => {
  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap">
      {types.map((type) => {
        if (feature.tags?.[type.value] === 'yes') {
          return (
            <StyledChip
              key={type.value}
              label={type.label}
              size="small"
              color="primary"
              variant="filled"
            />
          );
        }
        return null;
      })}
    </Stack>
  );
};
