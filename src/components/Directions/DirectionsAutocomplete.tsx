import { useMapStateContext } from '../utils/MapStateContext';
import { useStarsContext } from '../utils/StarsContext';
import React, { useEffect, useRef, useState } from 'react';
import { abortFetch } from '../../services/fetch';
import {
  fetchGeocoderOptions,
  GEOCODER_ABORTABLE_QUEUE,
  useInputValueState,
} from '../SearchBox/options/geocoder';
import { getStarsOptions } from '../SearchBox/options/stars';
import styled from '@emotion/styled';
import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import { useMapCenter } from '../SearchBox/utils';
import { useUserThemeContext } from '../../helpers/theme';
import { renderOptionFactory } from '../SearchBox/renderOptionFactory';
import PlaceIcon from '@mui/icons-material/Place';
import { Option } from '../SearchBox/types';
import { getOptionLabel } from '../SearchBox/getOptionLabel';
import { useUserSettingsContext } from '../utils/UserSettingsContext';
import { getCoordsOption } from '../SearchBox/options/coords';

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
  onFocus,
  onBlur,
}) => {
  const { InputLabelProps, InputProps, ...restParams } = params;

  useEffect(() => {
    // @ts-ignore
    params.InputProps.ref(autocompleteRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    onFocus();
    e.target.select();
  };

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
      onFocus={handleFocus}
      onBlur={onBlur}
    />
  );
};

// TODO: merge with useGetOptions
const useOptions = (inputValue: string) => {
  const { view } = useMapStateContext();
  const { stars } = useStarsContext();
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    (async () => {
      abortFetch(GEOCODER_ABORTABLE_QUEUE);

      if (inputValue === '') {
        setOptions(getStarsOptions(stars, inputValue));
        return;
      }

      await fetchGeocoderOptions({
        inputValue,
        view,
        before: [],
        after: [],
        setOptions,
      });
    })();
  }, [inputValue, stars]); // eslint-disable-line react-hooks/exhaustive-deps

  return options;
};
const Row = styled.div`
  width: 100%;
`;

type Props = {
  label: string;
  value: Option;
  setValue: (value: Option) => void;
};
export const DirectionsAutocomplete = ({ label, value, setValue }: Props) => {
  const autocompleteRef = useRef();
  const { inputValue, setInputValue } = useInputValueState();
  const selectedOptionInputValue = useRef(null);
  const mapCenter = useMapCenter();
  const { currentTheme } = useUserThemeContext();
  const { userSettings } = useUserSettingsContext();
  const { isImperial } = userSettings;
  const { mapClickOverrideRef } = useMapStateContext();

  const options = useOptions(inputValue);

  const onChange = (_: unknown, option: Option) => {
    console.log('selected', option); // eslint-disable-line no-console
    setInputValue(getOptionLabel(option));
    setValue(option);
    selectedOptionInputValue.current = getOptionLabel(option);
  };

  const onFocus = () => {
    mapClickOverrideRef.current = (coords, label) => {
      setValue(getCoordsOption(coords, label));
      setInputValue(label);
      selectedOptionInputValue.current = label;

      mapClickOverrideRef.current = undefined;
    };
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if ((e.relatedTarget as any)?.className !== 'maplibregl-canvas') {
      mapClickOverrideRef.current = undefined;
    }

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
  }, [setInputValue, value]);

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
            onFocus={onFocus}
            onBlur={onBlur}
          />
        )}
        renderOption={renderOptionFactory(
          inputValue,
          currentTheme,
          mapCenter,
          isImperial,
        )}
      />
    </Row>
  );
};
