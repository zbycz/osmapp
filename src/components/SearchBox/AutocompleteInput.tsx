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
import { useHandleDirectQuery } from './useHandleDirectQuery';
import { Setter } from '../../types';

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
  setIsLoading: Setter<boolean>;
};

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  autocompleteRef,
  setIsLoading,
}) => {
  const { inputValue, valueRef, setInputValue } = useInputValueState();
  const options = useGetOptions(inputValue, valueRef);
  const onHighlight = useGetOnHighlight();
  const onSelected = useGetOnSelected(setIsLoading);

  useHandleDirectQuery(onSelected, setInputValue, setIsLoading);

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
