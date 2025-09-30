import { Autocomplete, TextField } from '@mui/material';
import React from 'react';

export type Option = {
  label: string;
  value: string;
};

type AutocompleteSelectProps = {
  values: (string | Option)[];
  label: string;
  value: string | Option | null;
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: string | Option,
  ) => React.ReactNode;
  onChange: (
    event: React.SyntheticEvent,
    value: string | Option | null,
  ) => void;
  freeSolo?: boolean;
};

const getLabel = (option: string | Option): string =>
  typeof option === 'string' ? option : option.label;

const isEqual = (opt: string | Option, val: string | Option): boolean => {
  if (typeof opt === 'string' && typeof val === 'string') {
    return opt === val;
  }
  if (typeof opt !== 'string' && typeof val !== 'string') {
    return opt.value === val.value;
  }
  return false;
};

export const AutocompleteSelect = ({
  values,
  label,
  value,
  renderOption,
  onChange,
  freeSolo,
}: AutocompleteSelectProps) => (
  <Autocomplete
    freeSolo={freeSolo}
    options={values}
    getOptionLabel={getLabel}
    isOptionEqualToValue={isEqual}
    value={value}
    onChange={onChange}
    renderInput={(params) => (
      <TextField {...params} margin="dense" label={label} />
    )}
    renderOption={renderOption}
  />
);
