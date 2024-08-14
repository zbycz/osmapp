import React, { useEffect } from 'react';
import { Autocomplete, InputBase } from '@mui/material';
import { useFeatureContext } from '../utils/FeatureContext';
import { renderOptionFactory } from './renderOptionFactory';
import { t } from '../../services/intl';
import { onSelectedFactory } from './onSelectedFactory';
import { useUserThemeContext } from '../../helpers/theme';
import { useMapStateContext } from '../utils/MapStateContext';
import { onHighlightFactory } from './onHighlightFactory';
import { buildPhotonAddress } from './options/geocoder';
import { useMapCenter } from './utils';

const useFocusOnSlash = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeydown = (e) => {
      if (e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeydown);

    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, []);

  return inputRef;
};

const SearchBoxInput = ({ params, setInputValue, autocompleteRef }) => {
  const inputRef = useFocusOnSlash();
  const { InputLabelProps, InputProps, ...restParams } = params;

  useEffect(() => {
    // @ts-ignore
    params.InputProps.ref(autocompleteRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (e) => setInputValue(e.target.value);
  const onFocus = (e) => e.target.select();

  return (
    <InputBase
      {...restParams} // eslint-disable-line react/jsx-props-no-spreading
      sx={{
        height: '47px',
      }}
      inputRef={inputRef}
      placeholder={t('searchbox.placeholder')}
      onChange={onChange}
      onFocus={onFocus}
    />
  );
};

export const AutocompleteInput = ({
  inputValue,
  setInputValue,
  options,
  autocompleteRef,
  setOverpassLoading,
}) => {
  const { setFeature, setPreview } = useFeatureContext();
  const { bbox, showToast } = useMapStateContext();
  const mapCenter = useMapCenter();
  const { currentTheme } = useUserThemeContext();
  return (
    <Autocomplete
      inputValue={inputValue}
      options={options}
      // we need null to be able to select the same again (eg. category search)
      value={null}
      filterOptions={(x) => x}
      getOptionLabel={(option) =>
        option.properties?.name ||
        option.preset?.presetForSearch?.name ||
        option.overpass?.inputValue ||
        (option.star && option.star.label) ||
        (option.loader && '') ||
        (option.properties && buildPhotonAddress(option.properties)) ||
        ''
      }
      getOptionKey={(option) => JSON.stringify(option)}
      onChange={onSelectedFactory(
        setFeature,
        setPreview,
        bbox,
        showToast,
        setOverpassLoading,
      )}
      onHighlightChange={onHighlightFactory(setPreview)}
      getOptionDisabled={(o) => o.loader}
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
