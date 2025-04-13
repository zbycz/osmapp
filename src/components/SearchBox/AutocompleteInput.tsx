import React, { useEffect, useRef, useState } from 'react';
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
import { useKeyDown, useDebounce } from '../../helpers/hooks';
import { getOptionLabel } from './getOptionLabel';
import { useGetOptions } from './useGetOptions';
import { useInputValueState } from './options/geocoder';
import { useRouter } from 'next/router';
import { useUserSettingsContext } from '../utils/UserSettingsContext';
import { OptionsPaper, OptionsPopper } from './optionsPopper';

type SearchBoxInputProps = {
  params: any;
  setInputValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  autocompleteRef: React.MutableRefObject<undefined>;
  inputRef: React.RefObject<HTMLInputElement>;
};

const SearchBoxInput = ({
  params,
  setInputValue,
  autocompleteRef,
  inputRef,
}: SearchBoxInputProps) => {
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
      {...restParams}
      sx={{
        height: '47px',
      }}
      inputRef={inputRef}
      placeholder={t('searchbox.placeholder')}
      onChange={setInputValue}
      onFocus={({ target }) => target.select()}
    />
  );
};

type AutocompleteInputProps = {
  autocompleteRef: React.MutableRefObject<undefined>;
  setOverpassLoading: React.Dispatch<React.SetStateAction<boolean>>;
  initialQuery?: string;
};

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  autocompleteRef,
  setOverpassLoading,
  initialQuery,
}) => {
  const { setFeature, setPreview } = useFeatureContext();
  const { bbox } = useMapStateContext();
  const { showToast } = useSnackbar();
  const mapCenter = useMapCenter();
  const { currentTheme } = useUserThemeContext();
  const { inputValue, setInputValue } = useInputValueState();
  const options = useGetOptions(inputValue);
  const router = useRouter();
  const { userSettings } = useUserSettingsContext();
  const { isImperial } = userSettings;
  const inputRef = useRef<HTMLInputElement>(null);
  const lastInputValue = useRef(inputValue);
  const [isOpen, setIsOpen] = useState(false);

  // Handle qd parameter on mount
  useEffect(() => {
    const qd = router.query.qd;
    if (typeof qd === 'string') {
      // Set input value and wait for options
      setInputValue(qd);
      const timer = setTimeout(() => {
        if (options.length > 0) {
          const firstOption = options[0];
          if (
            firstOption.type === 'preset' ||
            firstOption.type === 'overpass'
          ) {
            // First perform the search
            onSelectedFactory({
              setFeature,
              setPreview,
              bbox,
              showToast,
              setOverpassLoading,
              router: {
                ...router,
                push: () => Promise.resolve(true), // Mock router.push to do nothing
              },
            })(null as never, firstOption);

            // Then update the URL after a delay to ensure the search is complete
            setTimeout(() => {
              const { qd: _, ...restQuery } = router.query;
              router.push(
                {
                  pathname: router.pathname,
                  query: restQuery, // Don't add q parameter to keep search box closed
                },
                undefined,
                { shallow: true },
              );
            }, 1000);
          }
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [router.query.qd, options.length]);

  // Only set initial query value on mount
  useEffect(() => {
    if (initialQuery && inputValue === '') {
      setInputValue(initialQuery);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update URL while typing (debounced)
  const debouncedInputValue = useDebounce(inputValue, 300);
  useEffect(() => {
    // Skip URL update if we're handling qd parameter
    if (router.query.qd) {
      return;
    }

    if (debouncedInputValue === lastInputValue.current) {
      return;
    }
    lastInputValue.current = debouncedInputValue;

    if (debouncedInputValue) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, q: debouncedInputValue },
        },
        undefined,
        { shallow: true },
      );
      setIsOpen(true); // Keep search box open when typing
    } else {
      // Remove q parameter when input is empty
      const { q, ...restQuery } = router.query;
      router.push(
        {
          pathname: router.pathname,
          query: restQuery,
        },
        undefined,
        { shallow: true },
      );
      setIsOpen(false); // Close search box when input is empty
    }
  }, [debouncedInputValue, router]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setIsOpen(!!newValue); // Open dialog when there's input
  };

  return (
    <Autocomplete
      inputValue={inputValue}
      options={options}
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
      })}
      onHighlightChange={onHighlightFactory(setPreview)}
      getOptionDisabled={(o) => o.type === 'loader'}
      autoComplete
      disableClearable
      autoHighlight
      clearOnEscape
      freeSolo
      open={isOpen}
      renderInput={(params) => (
        <SearchBoxInput
          params={params}
          setInputValue={handleInputChange}
          autocompleteRef={autocompleteRef}
          inputRef={inputRef}
        />
      )}
      slots={{ paper: OptionsPaper, popper: OptionsPopper }}
      renderOption={renderOptionFactory(
        inputValue,
        currentTheme,
        mapCenter,
        isImperial,
      )}
    />
  );
};
