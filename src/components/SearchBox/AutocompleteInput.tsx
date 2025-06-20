import React, { useState } from 'react';
import { Autocomplete } from '@mui/material';
import { renderOptionFactory } from './renderOptionFactory';
import { useGetOnSelected } from './useGetOnSelected';
import { useGetOnHighlight } from './useGetOnHighlight';
import { getOptionLabel } from './getOptionLabel';
import { useGetOptions } from './useGetOptions';
import { OptionsPaper, OptionsPopper } from './optionsPopper';
import { AutocompleteProps } from '@mui/material/Autocomplete/Autocomplete';
import { Option } from './types';
import { renderInputFactory } from './renderInputFactory';
import { useHandleDirectQuery } from './useHandleDirectQuery';
import { Setter } from '../../types';
import {
  setSearchUrl,
  useHandleQuery,
  useInputValueWithUrl,
} from './useHandleQuery';

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
  const [isOpen, setIsOpen] = useState(false);
  const { inputValue, valueRef, setInputValue } = useInputValueWithUrl();
  const options = useGetOptions(inputValue, valueRef);
  const onHighlight = useGetOnHighlight();
  const onSelected = useGetOnSelected(setIsLoading);

  useHandleDirectQuery(onSelected, setInputValue, setIsLoading);
  useHandleQuery(setInputValue, setIsOpen, valueRef);

  return (
    <AutocompleteConfigured
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        setSearchUrl('');
      }}
      onOpen={() => {
        setIsOpen(true);
        setSearchUrl(inputValue);
      }}
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
