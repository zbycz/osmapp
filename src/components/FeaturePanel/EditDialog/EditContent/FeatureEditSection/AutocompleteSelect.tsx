import { Autocomplete, TextField } from '@mui/material';
import React from 'react';

export const AutocompleteSelect = ({
  values,
  label,
  defaultValue,
  renderOption,
  onChange,
}) => {
  return (
    <Autocomplete
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
