import { Autocomplete, TextField } from '@mui/material';
import React from 'react';

export const AutocompleteSelect = ({
  values,
  label,
  defaultValue,
  renderOption,
  onChange,
  freeSolo,
}) => {
  return (
    <Autocomplete
      freeSolo={freeSolo}
      options={values}
      defaultValue={defaultValue}
      onChange={onChange}
      renderInput={(params) => (
        <TextField {...params} margin="dense" label={label} />
      )}
      renderOption={renderOption}
    />
  );
};
