import React from 'react';

import { MenuItem, Select } from '@material-ui/core';
import { GradeSystem } from './types';
import { gradeSystem } from './utils/gradeData';

type Props = {
  selectedGradeSystem: GradeSystem;
  setGradeSystem: (GradeSystem: GradeSystem) => void;
  onClick?: (e: any) => void;
};

export const GradeSystemSelect = ({
  selectedGradeSystem,
  setGradeSystem,
  onClick,
}: Props) => (
  <Select
    value={selectedGradeSystem}
    label="Grade system"
    onClick={onClick}
    onChange={(event: any) => {
      setGradeSystem(event.target.value);
    }}
  >
    {gradeSystem.map(({ key, name }) => (
      <MenuItem value={key}>{name}</MenuItem>
    ))}
  </Select>
);
