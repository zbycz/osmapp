import React, { useEffect } from 'react';
import { Autocomplete, InputBase } from '@mui/material';
import { useFeatureContext } from '../utils/FeatureContext';
import { renderOptionFactory } from './renderOptionFactory';
import { t } from '../../services/intl';
import { onSelectedFactory } from './onSelectedFactory';
import { useUserThemeContext } from '../../helpers/theme';
import { useMapStateContext } from '../utils/MapStateContext';
import { onHighlightFactory } from './onHighlightFactory';
import { useMapCenter } from './utils';
import { useSnackbar } from '../utils/SnackbarContext';
import { useKeyDown } from '../../helpers/hooks';
import { getOptionLabel } from './getOptionLabel';
import { useGetOptions } from './useGetOptions';
import { useInputValueState } from './options/geocoder';
import { useRouter } from 'next/router';
import { useHistoryContext } from './options/historyContext';

const SearchBoxInput = ({ params, setInputValue, autocompleteRef }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  useKeyDown('/', (e) => {
    const isInput = e.target instanceof HTMLInputElement;
    const isTextarea = e.target instanceof HTMLTextAreaElement;
    if (isInput || isTextarea) {
      return;
    }
    e.preventDefault();
    inputRef.current?.focus();
  });

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
  const mapCenter = useMapCenter();
  const { currentTheme } = useUserThemeContext();
  const { inputValue, setInputValue } = useInputValueState();
  const options = useGetOptions(inputValue);
  const router = useRouter();
  const { addOption } = useHistoryContext();

  return (
    <Autocomplete
      inputValue={inputValue}
      options={options}
      // we need null to be able to select the same again (eg. category search)
      value={null}
      filterOptions={(o) => o}
      getOptionLabel={getOptionLabel}
      getOptionKey={(option) => JSON.stringify(option)}
      onChange={onSelectedFactory({
        setFeature,
        setPreview,
        bbox,
        showToast,
        setOverpassLoading,
        router,
        addToHistoryOption: addOption,
      })}
      onHighlightChange={onHighlightFactory(setPreview)}
      getOptionDisabled={(o) => o.type === 'loader'}
      autoComplete
      disableClearable
      autoHighlight
      clearOnEscape
      // disableCloseOnSelect
      freeSolo
      // disableOpenOnFocus
      renderInput={(params) => (
        <SearchBoxInput
          params={params}
          setInputValue={setInputValue}
          autocompleteRef={autocompleteRef}
        />
      )}
      renderOption={renderOptionFactory(inputValue, currentTheme, mapCenter)}
    />
  );
};
