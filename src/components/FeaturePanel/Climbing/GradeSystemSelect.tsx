import React from 'react';

import { Select, MenuItem } from '@mui/material';
import { GRADE_SYSTEMS, GradeSystem } from './utils/grades/gradeData';

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
    {GRADE_SYSTEMS.map(({ key, name }) => (
      <MenuItem value={key}>{name}</MenuItem>
    ))}
  </Select>
);
