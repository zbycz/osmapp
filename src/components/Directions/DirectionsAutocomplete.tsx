import { MapClickOverride, useMapStateContext } from '../utils/MapStateContext';
import { useStarsContext } from '../utils/StarsContext';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { Option } from '../SearchBox/types';
import { getOptionLabel } from '../SearchBox/getOptionLabel';
import { useUserSettingsContext } from '../utils/UserSettingsContext';
import { getCoordsOption } from '../SearchBox/options/coords';
import { LonLat } from '../../services/types';
import { getGlobalMap } from '../../services/mapStorage';
import maplibregl, { LngLatLike, PointLike } from 'maplibre-gl';
import ReactDOMServer from 'react-dom/server';
import { AlphabeticalMarker } from './TextMarker';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { success } from '@maplibre/maplibre-gl-style-spec/src/util/result';
import { useIsClient } from '../helpers';
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
  pointIndex,
}) => {
  const { InputLabelProps, InputProps, ...restParams } = params;
  const isClient = useIsClient();
  useEffect(() => {
    // @ts-ignore
    params.InputProps.ref(autocompleteRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('___', e.target.value);
    setInputValue(e.target.value);
  };
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    onFocus();
    e.target.select();
  };

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // setLocation({ latitude, longitude });
    console.log(
      `___Latitude: ${latitude}, Longitude: ${longitude}`,
      getCoordsOption([50.08393943467965, 14.378495989338292], 'ahoj'),
    );
    // setInputValue(getCoordsOption([longitude, latitude], 'ahoj'));
    setInputValue(
      getCoordsOption([50.08393943467965, 14.378495989338292], 'ahoj'),
    );
  }

  const handleGetMyPosition = () => {
    console.log('___', navigator);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success);
    }
  };
  //Object.keys(navigator.geolocation).length !== 0
  return (
    <StyledTextField
      {...restParams} // eslint-disable-line react/jsx-props-no-spreading
      variant="outlined"
      size="small"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            sx={{ position: 'relative', top: 5, left: 5 }}
          >
            <AlphabeticalMarker hasPin={false} index={pointIndex} height={32} />
          </InputAdornment>
        ),
        endAdornment:
          isClient && navigator?.geolocation ? (
            <MyLocationIcon onClick={handleGetMyPosition} />
          ) : undefined,
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

const useInputMapClickOverride = (
  setValue: (value: Option) => void,
  setInputValue: (value: string) => void,
  selectedOptionInputValue: React.MutableRefObject<string | null>,
) => {
  const { mapClickOverrideRef } = useMapStateContext();
  const previousBehaviourRef = useRef<MapClickOverride>();

  const mapClickCallback = (coords: LonLat, label: string) => {
    setValue(getCoordsOption(coords, label));
    setInputValue(label);
    selectedOptionInputValue.current = label;

    mapClickOverrideRef.current = previousBehaviourRef.current;
  };

  const onInputFocus = () => {
    previousBehaviourRef.current = mapClickOverrideRef.current;
    mapClickOverrideRef.current = mapClickCallback;
  };

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if ((e.relatedTarget as any)?.className !== 'maplibregl-canvas') {
      mapClickOverrideRef.current = previousBehaviourRef.current;
    }
  };

  return { onInputFocus, onInputBlur };
};

type Props = {
  label: string;
  value: Option;
  setValue: (value: Option) => void;
  pointIndex: number;
};

export const DirectionsAutocomplete = ({
  label,
  value,
  setValue,
  pointIndex,
}: Props) => {
  const autocompleteRef = useRef();
  const { inputValue, setInputValue } = useInputValueState();
  const selectedOptionInputValue = useRef<string | null>(null);
  const mapCenter = useMapCenter();
  const { currentTheme } = useUserThemeContext();
  const { userSettings } = useUserSettingsContext();
  const { isImperial } = userSettings;

  const ALPHABETICAL_MARKER = useMemo(() => {
    let svgElement;
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      svgElement = document.createElement('div');
      svgElement.innerHTML = ReactDOMServer.renderToStaticMarkup(
        <AlphabeticalMarker index={pointIndex} hasShadow width={27} />,
      );
    } else svgElement = undefined;

    return {
      color: 'salmon',
      draggable: true,
      element: svgElement,
      offset: [0, -10] as PointLike,
    };
  }, [pointIndex]);

  const markerRef = useRef<maplibregl.Marker>();

  useEffect(() => {
    const map = getGlobalMap();
    if (value?.type === 'coords') {
      markerRef.current = new maplibregl.Marker(ALPHABETICAL_MARKER)
        .setLngLat(value.coords.center as LngLatLike)
        .addTo(map);
    }
    return () => {
      markerRef.current?.remove();
    };
  }, [ALPHABETICAL_MARKER, value]);

  const onDragEnd = () => {
    const lngLat = markerRef.current?.getLngLat();
    if (lngLat) {
      setValue(getCoordsOption([lngLat.lng, lngLat.lat]));
    }
  };

  markerRef.current?.on('dragend', onDragEnd);

  const options = useOptions(inputValue);

  const onChange = (_: unknown, option: Option) => {
    console.log('selected', option); // eslint-disable-line no-console
    setInputValue(getOptionLabel(option));
    setValue(option);
    selectedOptionInputValue.current = getOptionLabel(option);
  };

  const { onInputFocus, onInputBlur } = useInputMapClickOverride(
    setValue,
    setInputValue,
    selectedOptionInputValue,
  );

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onInputBlur(e);

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
            onFocus={onInputFocus}
            onBlur={handleBlur}
            pointIndex={pointIndex}
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
