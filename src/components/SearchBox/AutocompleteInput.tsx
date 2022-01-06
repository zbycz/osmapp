import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect } from 'react';
import InputBase from '@material-ui/core/InputBase';
import { useFeatureContext } from '../utils/FeatureContext';
import { renderOptionFactory, buildPhotonAddress } from './renderOptionFactory';
import { t } from '../../services/intl';
import { onHighlightFactory, onSelectedFactory } from './onSelectedFactory';
import { useMobileMode } from '../helpers';

const SearchBoxInput = ({ params, setInputValue, autocompleteRef }) => {
  const { InputLabelProps, InputProps, ...restParams } = params;

  useEffect(() => {
    // @ts-ignore
    params.InputProps.ref(autocompleteRef.current);
  }, []);

  const onChange = (e) => setInputValue(e.target.value);
  const onFocus = (e) => e.target.select();

  return (
    <InputBase
      placeholder={t('searchbox.placeholder')}
      {...restParams} // eslint-disable-line react/jsx-props-no-spreading
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
}) => {
  const { setFeature, setPreview } = useFeatureContext();
  const mobileMode = useMobileMode();
  return (
    <Autocomplete
      inputValue={inputValue}
      options={options}
      filterOptions={(x) => x}
      getOptionLabel={(option) =>
        option.properties.name || buildPhotonAddress(option.properties)
      }
      onChange={onSelectedFactory(setFeature, setPreview, mobileMode)}
      onHighlightChange={onHighlightFactory(setPreview)}
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
      renderOption={renderOptionFactory(inputValue)}
    />
  );
};
