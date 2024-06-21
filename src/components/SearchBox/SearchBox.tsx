import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, IconButton, Paper } from '@mui/material';
import Router from 'next/router';
import { abortFetch, fetchJson } from '../../services/fetch';
import { useMapStateContext } from '../utils/MapStateContext';
import { useFeatureContext } from '../utils/FeatureContext';
import { AutocompleteInput } from './AutocompleteInput';
import { intl, t } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { isDesktop, useMobileMode } from '../helpers';
import { SEARCH_BOX_HEIGHT } from './consts';
import { useStarsContext } from '../utils/StarsContext';
import { getOverpassOptions } from './options/overpass';
import { getPresetOptions } from './options/preset';
import { getStarsOptions } from './options/stars';

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

const PHOTON_SUPPORTED_LANGS = ['en', 'de', 'fr'];

const getApiUrl = (inputValue, view) => {
  const [zoom, lat, lon] = view;
  const lvl = Math.max(0, Math.min(16, Math.round(zoom)));
  const q = encodeURIComponent(inputValue);
  const lang = intl.lang in PHOTON_SUPPORTED_LANGS ? intl.lang : 'default';
  return `https://photon.komoot.io/api/?q=${q}&lon=${lon}&lat=${lat}&zoom=${lvl}&lang=${lang}`;
};

// https://docs.mapbox.com/help/troubleshooting/working-with-large-geojson-data/

const GEOCODER_ABORTABLE_QUEUE = 'search';

let currentInput = '';
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

const getGeocoderOptions = debounce(
  async (inputValue, view, setOptions, before, after) => {
    try {
      const searchResponse = await fetchJson(getApiUrl(inputValue, view), {
        abortableQueueName: GEOCODER_ABORTABLE_QUEUE,
      });

      // This blocks rendering of old result, when user already changed input
      if (inputValue !== currentInput) {
        return;
      }

      const options = searchResponse?.features || [];

      setOptions([...before, ...options, ...after]);
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) {
        throw e;
      }
    }
  },
  400,
);

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
