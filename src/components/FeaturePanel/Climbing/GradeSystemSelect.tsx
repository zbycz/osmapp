import React from 'react';

import { Select, MenuItem, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import styled from 'styled-components';
import { GRADE_SYSTEMS, GradeSystem } from './utils/grades/gradeData';

type Props = {
  selectedGradeSystem: GradeSystem;
  setGradeSystem: (GradeSystem: GradeSystem) => void;
  onClick?: (e: any) => void;
  allowUnsetValue?: boolean;
};

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`;
const StyledInfoOutlinedIcon = styled(InfoOutlinedIcon)`
  position: relative;
  top: 2px;
`;

export const GradeSystemSelect = ({
  selectedGradeSystem,
  setGradeSystem,
  onClick,
  allowUnsetValue = true,
}: Props) => (
  <Select
    value={selectedGradeSystem}
    size="small"
    variant="standard"
    onClick={onClick}
    onChange={(event: any) => {
      setGradeSystem(event.target.value);
    }}
  >
    {allowUnsetValue && <MenuItem value={null}>Original grade</MenuItem>}
    {GRADE_SYSTEMS.map(({ key, name, description }) => (
      <MenuItem value={key}>
        <Row>
          <div>{name}</div>
          <Tooltip arrow title={description} placement="right">
            <StyledInfoOutlinedIcon fontSize="small" color="secondary" />
          </Tooltip>
        </Row>
      </MenuItem>
    ))}
  </Select>
);
