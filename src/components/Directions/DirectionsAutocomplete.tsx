import { useMapStateContext } from '../utils/MapStateContext';
import { useStarsContext } from '../utils/StarsContext';
import React, { useEffect, useRef, useState } from 'react';
import { abortFetch } from '../../services/fetch';
import {
  buildPhotonAddress,
  fetchGeocoderOptions,
  GEOCODER_ABORTABLE_QUEUE,
  useInputValueState,
} from '../SearchBox/options/geocoder';
import { getStarsOptions } from '../SearchBox/options/stars';
import styled from '@emotion/styled';
import {
  Autocomplete,
  InputAdornment,
  InputBase,
  TextField,
} from '@mui/material';
import { useMapCenter } from '../SearchBox/utils';
import { useUserThemeContext } from '../../helpers/theme';
import { renderOptionFactory } from '../SearchBox/renderOptionFactory';
import PlaceIcon from '@mui/icons-material/Place';
import { SearchOption } from '../SearchBox/types';
import { useRouter } from 'next/router';
import { destroyRouting, splitByFirstTilda } from './utils';

const StyledTextField = styled(TextField)`
  input::placeholder {
    font-size: 0.9rem;
  }
`;

const DirectionsInput = ({
  params,
  setInputValue,
  autocompleteRef,
  label,
  onBlur,
}) => {
  const { InputLabelProps, InputProps, ...restParams } = params;

  useEffect(() => {
    // @ts-ignore
    params.InputProps.ref(autocompleteRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (e) => setInputValue(e.target.value);
  const onFocus = (e) => e.target.select();

  return (
    <StyledTextField
      {...restParams} // eslint-disable-line react/jsx-props-no-spreading
      variant="outlined"
      size="small"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PlaceIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
      placeholder={label}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};
const useOptions = (inputValue: string, setOptions) => {
  const { view } = useMapStateContext();
  const { stars } = useStarsContext();

  useEffect(() => {
    (async () => {
      abortFetch(GEOCODER_ABORTABLE_QUEUE);

      if (inputValue === '') {
        setOptions(getStarsOptions(stars));
        return;
      }

      fetchGeocoderOptions(inputValue, view, setOptions, [], []);
    })();
  }, [inputValue, stars]); // eslint-disable-line react-hooks/exhaustive-deps
};
const Row = styled.div`
  width: 100%;
`;

export const getOptionLabel = (option) =>
  option == null
    ? ''
    : option.properties?.name ||
      (option.star && option.star.label) ||
      (option.properties && buildPhotonAddress(option.properties)) ||
      '';

export const getOptionCoords = (option) => {
  const lonLat =
    (option.star && option.star.center) || option.geometry.coordinates;
  return lonLat.join(',');
};

type Props = {
  label: string;
  value: string;
  setValue: (value: string) => void;
};
export const DirectionsAutocomplete = ({ label, value, setValue }: Props) => {
  const autocompleteRef = useRef();
  const { inputValue, setInputValue } = useInputValueState();
  const selectedOptionInputValue = useRef(null);
  const [options, setOptions] = useState([]);
  const mapCenter = useMapCenter();
  const { currentTheme } = useUserThemeContext();

  useOptions(inputValue, setOptions);

  const onChange = (_, option) => {
    console.log('selected', option); // eslint-disable-line no-console
    setInputValue(getOptionLabel(option));
    setValue(option);
    selectedOptionInputValue.current = getOptionLabel(option);
  };

  const onBlur = () => {
    if (selectedOptionInputValue.current !== inputValue) {
      if (options.length > 0 && inputValue) {
        onChange(null, options[0]);
      } else {
        setValue(null);
      }
    }
  };

  // react to external value changes
  useEffect(() => {
    if (getOptionLabel(value) !== selectedOptionInputValue.current) {
      setInputValue(getOptionLabel(value));
      selectedOptionInputValue.current = getOptionLabel(value);
    }
  }, [value]);

  return (
    <Row ref={autocompleteRef}>
      <Autocomplete
        inputValue={inputValue}
        options={options}
        value={null}
        filterOptions={(x) => x}
        getOptionLabel={getOptionLabel}
        getOptionKey={(option) => JSON.stringify(option)}
        onChange={onChange}
        autoComplete
        disableClearable
        autoHighlight
        clearOnEscape
        renderInput={(params) => (
          <DirectionsInput
            params={params}
            setInputValue={setInputValue}
            autocompleteRef={autocompleteRef}
            label={label}
            onBlur={onBlur}
          />
        )}
        renderOption={renderOptionFactory(inputValue, currentTheme, mapCenter)}
      />
    </Row>
  );
};
