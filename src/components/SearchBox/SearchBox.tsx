import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, IconButton, Paper } from '@mui/material';
import Router from 'next/router';
import { abortFetch } from '../../services/fetch';
import { useMapStateContext } from '../utils/MapStateContext';
import { useFeatureContext } from '../utils/FeatureContext';
import { AutocompleteInput } from './AutocompleteInput';
import { t } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { isDesktop, useMobileMode } from '../helpers';
import { SEARCH_BOX_HEIGHT } from './consts';
import { useStarsContext } from '../utils/StarsContext';
import { getOverpassOptions } from './options/overpass';
import { getPresetOptions } from './options/preset';
import { getStarsOptions } from './options/stars';
import {
  currentInput,
  GEOCODER_ABORTABLE_QUEUE,
  getGeocoderOptions,
} from './options/geocoder';

const TopPanel = styled.div`
  position: absolute;
  height: ${SEARCH_BOX_HEIGHT}px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.12);
  background-color: ${({ theme }) => theme.palette.background.searchBox};
  padding: 10px;
  box-sizing: border-box;

  z-index: 1200;

  width: 100%;
  @media ${isDesktop} {
    width: 410px;
  }
`;

const StyledPaper = styled(Paper)`
  padding: 2px 4px;
  display: flex;
  align-items: center;

  .MuiAutocomplete-root {
    flex: 1;
  }
`;

const SearchIconButton = styled(IconButton)`
  svg {
    transform: scaleX(-1);
    filter: FlipH;
    -ms-filter: 'FlipH';
  }
`;

const OverpassCircularProgress = styled(CircularProgress)`
  padding: 10px;
`;

// https://docs.mapbox.com/help/troubleshooting/working-with-large-geojson-data/

const useInputValueState = () => {
  const [inputValue, setInputValue] = useState('');
  return {
    inputValue,
    setInputValue: useCallback((value) => {
      currentInput = value;
      setInputValue(value);
    }, []),
  };
};

const useOptions = (inputValue: string, setOptions) => {
  const { view } = useMapStateContext();
  const { stars } = useStarsContext();

  useEffect(() => {
    (async () => {
      abortFetch(GEOCODER_ABORTABLE_QUEUE);

      if (inputValue === '') {
        setOptions(getStarsOptions(stars, inputValue));
        return;
      }

      const overpassOptions = getOverpassOptions(inputValue);
      if (overpassOptions.length) {
        setOptions(overpassOptions);
        return;
      }

      const { before, after } = await getPresetOptions(inputValue);
      setOptions([...before, { loader: true }]);

      getGeocoderOptions(inputValue, view, setOptions, before, after);
    })();
  }, [inputValue, stars]);
};

const useOnClosePanel = () => {
  const { feature, setFeature, setPreview } = useFeatureContext();
  const mobileMode = useMobileMode();

  return () => {
    if (mobileMode) {
      setPreview(feature);
    }
    setFeature(null);
    Router.push(`/${window.location.hash}`);
  };
};

const SearchBox = () => {
  const { featureShown } = useFeatureContext();
  const { inputValue, setInputValue } = useInputValueState();
  const [options, setOptions] = useState([]);
  const [overpassLoading, setOverpassLoading] = useState(false);
  const autocompleteRef = useRef();
  const onClosePanel = useOnClosePanel();

  useOptions(inputValue, setOptions);

  return (
    <TopPanel>
      <StyledPaper elevation={1} ref={autocompleteRef}>
        <SearchIconButton disabled aria-label={t('searchbox.placeholder')}>
          <SearchIcon />
        </SearchIconButton>

        <AutocompleteInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          options={options}
          autocompleteRef={autocompleteRef}
          setOverpassLoading={setOverpassLoading}
        />

        {featureShown && <ClosePanelButton onClick={onClosePanel} />}
        {overpassLoading && <OverpassCircularProgress />}
      </StyledPaper>
    </TopPanel>
  );
};

export default SearchBox;
