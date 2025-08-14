import { useRef } from 'react';
import React, { useEffect } from 'react';
import { AutocompleteRenderInputParams } from '@mui/material/Autocomplete/Autocomplete';
import { useFocusOnSlash } from '../../helpers/hooks';
import { InputBase } from '@mui/material';
import { t } from '../../services/intl';
import { Setter } from '../../types';

type SearchBoxInputProps = {
  params: AutocompleteRenderInputParams;
  setInputValue: (value: string) => void;
  autocompleteRef: React.MutableRefObject<undefined>;
};

const SearchBoxInput = ({
  params,
  setInputValue,
  autocompleteRef,
}: SearchBoxInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useFocusOnSlash(inputRef);

  const { InputLabelProps, InputProps, ...restParams } = params;

  useEffect(() => {
    // @ts-ignore
    params.InputProps.ref(autocompleteRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <InputBase
      {...restParams} // eslint-disable-line react/jsx-props-no-spreading
      sx={{ height: '47px' }}
      inputRef={inputRef}
      placeholder={t('searchbox.placeholder')}
      onChange={({ target }) => setInputValue(target.value)}
      onFocus={({ target }) => target.select()}
    />
  );
};

export const renderInputFactory = (
  setInputValue: Setter<string>,
  autocompleteRef: React.MutableRefObject<undefined>,
) => {
  const renderInputFn = (params: AutocompleteRenderInputParams) => (
    <SearchBoxInput
      params={params}
      setInputValue={setInputValue}
      autocompleteRef={autocompleteRef}
    />
  );
  return renderInputFn;
};
