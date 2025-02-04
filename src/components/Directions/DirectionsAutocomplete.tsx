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
import {
  Autocomplete,
  InputAdornment,
  TextField,
  Tooltip,
  useTheme,
} from '@mui/material';
import { useMapCenter } from '../SearchBox/utils';
import { useUserThemeContext } from '../../helpers/theme';
import { renderOptionFactory } from '../SearchBox/renderOptionFactory';
import { Option } from '../SearchBox/types';
import { getOptionLabel } from '../SearchBox/getOptionLabel';
import { useUserSettingsContext } from '../utils/UserSettingsContext';
import { getDirectionsCoordsOption } from '../SearchBox/options/coords';
import { LonLat } from '../../services/types';
import { getGlobalMap } from '../../services/mapStorage';
import maplibregl, { LngLatLike, PointLike } from 'maplibre-gl';
import ReactDOMServer from 'react-dom/server';
import { AlphabeticalMarker } from './TextMarker';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { DotLoader, useIsClient } from '../helpers';
import { useSnackbar } from '../utils/SnackbarContext';
import { useGetOnSubmitFactory, useUpdatePoint } from './useGetOnSubmit';
import { useDirectionsContext } from './DirectionsContext';
import { removeElementOnIndex } from '../FeaturePanel/Climbing/utils/array';
const DotLoaderContainer = styled.div`
  font-size: 16px;
  right: 6px;
  top: -4px;
  position: relative;
`;

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
  onOptionChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { InputLabelProps, InputProps, ...restParams } = params;
  const isClient = useIsClient();
  const { showToast } = useSnackbar();
  const theme = useTheme();

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
    setIsFocused(true);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur(e);
    setIsFocused(false);
  };

  function handleSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    onOptionChange(
      null,
      getDirectionsCoordsOption([longitude, latitude], 'My location'),
    );
    setIsLoading(false);
  }
  const handleError = (_error) => {
    setIsLoading(false);
    showToast("Sorry, we couldn't find your location", 'error');
  };

  const handleGetMyPosition = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      timeout: 10000,
    });
  };

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
          isClient && isFocused && navigator?.geolocation ? (
            isLoading ? (
              <DotLoaderContainer>
                <DotLoader />
              </DotLoaderContainer>
            ) : (
              <Tooltip title="Get my location">
                <MyLocationIcon
                  color="secondary"
                  sx={{ cursor: 'pointer' }}
                  onClick={handleGetMyPosition}
                />
              </Tooltip>
            )
          ) : undefined,
        style: { paddingRight: 12 },
      }}
      placeholder={label}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
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
  pointIndex: number,
  setInputValue: (value: string) => void,
  selectedOptionInputValue: React.MutableRefObject<string | null>,
) => {
  const { mapClickOverrideRef } = useMapStateContext();
  const previousBehaviourRef = useRef<MapClickOverride>();
  const updatePoint = useUpdatePoint();

  const mapClickCallback = (coords: LonLat, label: string) => {
    updatePoint(pointIndex, getDirectionsCoordsOption(coords, label));
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
  pointIndex: number;
};

export const DirectionsAutocomplete = ({ label, value, pointIndex }: Props) => {
  const autocompleteRef = useRef();
  const { inputValue, setInputValue } = useInputValueState();
  const selectedOptionInputValue = useRef<string | null>(null);
  const mapCenter = useMapCenter();
  const { currentTheme } = useUserThemeContext();
  const { userSettings } = useUserSettingsContext();
  const { isImperial } = userSettings;
  const updatePoint = useUpdatePoint();

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
  const { points, mode, setResult, setLoading, setPoints } =
    useDirectionsContext();
  const submitFactory = useGetOnSubmitFactory(setResult, setLoading);

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

  const handleUpdate = (coordsOption: Option) => {
    const newPoints = updatePoint(pointIndex, coordsOption);
    submitFactory(newPoints, mode);
  };

  const onDragEnd = () => {
    const lngLat = markerRef.current?.getLngLat();
    if (lngLat) {
      const coordsOption = getDirectionsCoordsOption([lngLat.lng, lngLat.lat]);
      handleUpdate(coordsOption);
    }
  };

  markerRef.current?.on('dragend', onDragEnd);

  const options = useOptions(inputValue);

  const onChange = (_: unknown, option: Option) => {
    console.log('selected', option); // eslint-disable-line no-console
    setInputValue(getOptionLabel(option));
    selectedOptionInputValue.current = getOptionLabel(option);
    handleUpdate(option);
  };

  const { onInputFocus, onInputBlur } = useInputMapClickOverride(
    pointIndex,
    setInputValue,
    selectedOptionInputValue,
  );

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onInputBlur(e);

    if (selectedOptionInputValue.current !== inputValue) {
      if (options.length > 0 && inputValue) {
        onChange(null, options[0]);
      } else if (points) {
        setPoints(removeElementOnIndex(points, pointIndex));
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
        noOptionsText=""
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
            onOptionChange={onChange}
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
