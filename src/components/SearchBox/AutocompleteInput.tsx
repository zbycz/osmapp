import React, { useEffect } from 'react';
import { Autocomplete, InputBase } from '@mui/material';
import { useFeatureContext } from '../utils/FeatureContext';
import { renderOptionFactory } from './renderOptionFactory';
import { t } from '../../services/intl';
import { onSelectedFactory } from './onSelectedFactory';
import { useMapStateContext } from '../utils/MapStateContext';
import { onHighlightFactory } from './onHighlightFactory';
import { useSnackbar } from '../utils/SnackbarContext';
import { useFocusOnSlash } from '../../helpers/hooks';
import { getOptionLabel } from './getOptionLabel';
import { useGetOptions } from './useGetOptions';
import { useInputValueState } from './options/geocoder';
import { useRouter } from 'next/router';
import { OptionsPaper, OptionsPopper } from './optionsPopper';
import {
  AutocompleteProps,
  AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete/Autocomplete';
import { Option } from './types';

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
  const inputRef = React.useRef<HTMLInputElement>(null);
  useFocusOnSlash(inputRef);

  const { InputLabelProps, InputProps, ...restParams } = params;

  useEffect(() => {
    // @ts-ignore
    params.InputProps.ref(autocompleteRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <InputBase
      {...restParams} // eslint-disable-line react/jsx-props-no-spreading
      sx={{
        height: '47px',
      }}
      inputRef={inputRef}
      placeholder={t('searchbox.placeholder')}
      onChange={({ target }) => setInputValue(target.value)}
      onFocus={({ target }) => target.select()}
    />
  );
};

const AutocompleteConfigured = (
  props: AutocompleteProps<Option, false, true, true>,
) => (
  <Autocomplete
    value={null} // we need value=null to be able to select the same again (eg. fire same category search again)
    autoComplete
    disableClearable
    // disableCloseOnSelect
    // disableOpenOnFocus
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
  const { setFeature, setPreview } = useFeatureContext();
  const { bbox } = useMapStateContext();
  const { showToast } = useSnackbar();
  const { inputValue, setInputValue } = useInputValueState();
  const options = useGetOptions(inputValue);
  const router = useRouter();

  return (
    <AutocompleteConfigured
      inputValue={inputValue}
      options={options}
      getOptionDisabled={(o) => o.type === 'loader'}
      filterOptions={(o) => o}
      getOptionLabel={getOptionLabel}
      getOptionKey={(option) => JSON.stringify(option)}
      onHighlightChange={onHighlightFactory(setPreview)}
      onChange={onSelectedFactory({
        setFeature,
        setPreview,
        bbox,
        showToast,
        setOverpassLoading,
        router,
      })}
      renderOption={renderOptionFactory(inputValue)}
      renderInput={(params) => (
        <SearchBoxInput
          params={params}
          setInputValue={setInputValue}
          autocompleteRef={autocompleteRef}
        />
      )}
    />
  );
};
