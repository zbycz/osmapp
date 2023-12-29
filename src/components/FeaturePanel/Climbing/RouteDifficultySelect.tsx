import React from 'react';
import styled from 'styled-components';
import { MenuItem, Select, TextField } from '@material-ui/core';
import { RouteDifficulty } from './types';

const Flex = styled.div`
  display: flex;
`;

type Props = {
  difficulty: RouteDifficulty;
  onClick: () => void;
};

// const options = [
//   { label: 'The Godfather', id: 1 },
//   { label: 'Pulp Fiction', id: 2 },
// ];
export const RouteDifficultySelect = ({ difficulty, onClick }: Props) => (
  <Flex>
    {/* <Autocomplete
        options={options}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      /> */}
    <TextField
      size="small"
      value={difficulty.grade}
      // onChange={(e) => onTempRouteChange(e, 'difficulty')}
      onClick={onClick}
      style={{ paddingTop: 0 }}
    />

    <Select
      value={difficulty.gradeSystem}
      label="Grade system"
      onChange={() => {}}
    >
      <MenuItem value="uiaa">UIAA (recommended)</MenuItem>
      <MenuItem value="uktech">UK tech</MenuItem>
      <MenuItem value="ukadj">UKA adj</MenuItem>
      <MenuItem value="fb">French British</MenuItem>
      <MenuItem value="french">French</MenuItem>
      <MenuItem value="saxon">Saxon</MenuItem>
      <MenuItem value="nordic">Nordic</MenuItem>
      <MenuItem value="yds">yds</MenuItem>
      <MenuItem value="vgrade">vgrade</MenuItem>
      <MenuItem value="wi">wi</MenuItem>
      <MenuItem value="mixed">Mixed</MenuItem>
    </Select>
  </Flex>
);
