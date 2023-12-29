import React from 'react';

import { MenuItem, Select } from '@material-ui/core';
import { GradeSystem } from './utils/gradeTable';

type Props = {
  gradeSystem: GradeSystem;
  setGradeSystem: (GradeSystem: GradeSystem) => void;
  onClick?: (e: any) => void;
};

export const GradeSystemSelect = ({
  gradeSystem,
  setGradeSystem,
  onClick,
}: Props) => (
  <Select
    value={gradeSystem}
    label="Grade system"
    onClick={onClick}
    onChange={(event: any) => {
      setGradeSystem(event.target.value);
    }}
  >
    <MenuItem value="uiaa">UIAA (recommended)</MenuItem>
    <MenuItem value="uktech">UK tech</MenuItem>
    <MenuItem value="ukadj">UKA adj</MenuItem>
    <MenuItem value="fb">French British</MenuItem>
    <MenuItem value="french">French</MenuItem>
    <MenuItem value="saxon">Saxon</MenuItem>
    <MenuItem value="nordic">Nordic</MenuItem>
    <MenuItem value="yds">YDS</MenuItem>
    <MenuItem value="vgrade">V grade</MenuItem>
    <MenuItem value="wi">WI</MenuItem>
    <MenuItem value="mixed">Mixed</MenuItem>
  </Select>
);
