import React from 'react';
import { Autocomplete } from '@mui/material';
import { renderOptionFactory } from './renderOptionFactory';
import { useGetOnSelected } from './useGetOnSelected';
import { useGetOnHighlight } from './useGetOnHighlight';
import { getOptionLabel } from './getOptionLabel';
import { useGetOptions } from './useGetOptions';
import { useInputValueState } from './options/geocoder';
import { OptionsPaper, OptionsPopper } from './optionsPopper';
import { AutocompleteProps } from '@mui/material/Autocomplete/Autocomplete';
import { Option } from './types';
import { renderInputFactory } from './renderInputFactory';

const AutocompleteConfigured = (
  props: AutocompleteProps<Option, false, true, true>,
) => (
  <Autocomplete
    value={null} // we need value=null to be able to select the same again (eg. fire same category search again)
    autoComplete
    disableClearable
    autoHighlight
    clearOnEscape
    freeSolo
    slots={{ paper: OptionsPaper, popper: OptionsPopper }}
    {...props} // eslint-disable-line react/jsx-props-no-spreading
  />
);

type AutocompleteInputProps = {
  autocompleteRef: React.MutableRefObject<undefined>;
  setOverpassLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  autocompleteRef,
  setOverpassLoading,
}) => {
  const { inputValue, setInputValue } = useInputValueState();
  const options = useGetOptions(inputValue);
  const onHighlight = useGetOnHighlight();
  const onSelected = useGetOnSelected(setOverpassLoading);

  return (
    <AutocompleteConfigured
      inputValue={inputValue}
      options={options}
      getOptionLabel={getOptionLabel}
      onChange={onSelected}
      onHighlightChange={onHighlight}
      renderOption={renderOptionFactory(inputValue)}
      renderInput={renderInputFactory(setInputValue, autocompleteRef)}
      filterOptions={(option) => option}
      getOptionDisabled={(option) => option.type === 'loader'}
      getOptionKey={(option) => JSON.stringify(option)}
    />
  );
};
