import React from 'react';
import { Feature } from '../../../services/types';
import styled from '@emotion/styled';
import { Chip } from '@mui/material';

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

export const ClimbingTypeBadge = ({ feature }: Props) => {
  if (feature.tags?.['climbing:boulder'] === 'yes')
    return (
      <StyledChip
        label="boulder"
        size="small"
        color="primary"
        variant="filled"
      />
    );
  return null;
};
