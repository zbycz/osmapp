import { Autocomplete, TextField } from '@mui/material';
import React from 'react';

type AutocompleteSelectProps = {
  values: string[];
  label: string;
  defaultValue: string;
  renderOption?: any;
  onChange: (event: React.SyntheticEvent, value: string | null) => void;
  freeSolo?: boolean;
};

export const AutocompleteSelect = ({
  values,
  label,
  defaultValue,
  renderOption,
  onChange,
  freeSolo,
}: AutocompleteSelectProps) => {
  return (
    <Autocomplete
      freeSolo={freeSolo}
      options={values}
      defaultValue={defaultValue}
      onChange={onChange}
      onInputChange={onChange}
      renderInput={(params) => (
        <TextField {...params} margin="dense" label={label} />
      )}
      renderOption={renderOption}
    />
  );
};
