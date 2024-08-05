import React from 'react';
import { FormControl, MenuItem, Select, Tooltip } from '@mui/material';
import styled from 'styled-components';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { TickStyle } from '../types';
import { tickStyles } from '../../../../services/ticks';

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

export const TickStyleSelect = ({
  value,
  onChange,
}: {
  value: TickStyle;
  onChange: (e) => void;
}) => (
  <FormControl size="small">
    <Select value={value} onChange={onChange}>
      {tickStyles.map((tickStyle) => (
        <MenuItem value={tickStyle.key}>
          <Row>
            <div>{tickStyle.name}</div>
            <Tooltip arrow title={tickStyle.description} placement="right">
              <StyledInfoOutlinedIcon fontSize="small" color="secondary" />
            </Tooltip>
          </Row>
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
