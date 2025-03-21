import React from 'react';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
  Select,
  MenuItem,
  Tooltip,
  FormControl,
  IconButton,
  Stack,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import styled from '@emotion/styled';
import { GRADE_SYSTEMS, GradeSystem } from '../../../services/tagging/climbing';
import Link from 'next/link';

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
  <Stack direction="row" spacing={1} alignItems="center">
    <FormControl size="small">
      <Select
        value={selectedGradeSystem}
        onClick={onClick}
        onChange={(event: any) => {
          setGradeSystem(event.target.value);
        }}
      >
        {allowUnsetValue && <MenuItem value={null}>Original grade</MenuItem>}
        {GRADE_SYSTEMS.map(({ key, name, description }) => (
          <MenuItem key={key} value={key}>
            <Row>
              <div>{name}</div>
              <Tooltip arrow title={description} placement="right">
                <StyledInfoOutlinedIcon fontSize="small" color="secondary" />
              </Tooltip>
            </Row>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <Tooltip title="Show grades conversion table">
      <Link href="/__mocks__/climbing-grades">
        <IconButton size="small" color="secondary">
          <ViewListIcon fontSize="small" />
        </IconButton>
      </Link>
    </Tooltip>
  </Stack>
);
