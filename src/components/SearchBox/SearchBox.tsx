import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Router from 'next/router';
import match from 'autosuggest-highlight/match';

import { fetchJson } from '../../services/fetch';
import { useMapStateContext } from '../utils/MapStateContext';
import { useFeatureContext } from '../utils/FeatureContext';
import { AutocompleteInput } from './AutocompleteInput';
import { t } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { isDesktop, useMobileMode } from '../helpers';
import { presets } from '../../services/tagging/data';
import {
  fetchSchemaTranslations,
  getPresetTermsTranslation,
  getPresetTranslation,
} from '../../services/tagging/translations';

const TopPanel = styled.div`
  position: absolute;
  height: 72px;
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

const getApiUrl = (inputValue, view) => {
  const [zoom, lat, lon] = view;
  const lvl = Math.max(0, Math.min(16, Math.round(zoom)));
  const q = encodeURIComponent(inputValue);
  return `https://photon.komoot.io/api/?q=${q}&lon=${lon}&lat=${lat}&zoom=${lvl}`;
};

// https://docs.mapbox.com/help/troubleshooting/working-with-large-geojson-data/

let presetsForSearch = [];

fetchSchemaTranslations().then(() => {
  // resolve symlinks to {landuse...} etc
  presetsForSearch = Object.values(presets).map(
    ({ name, presetKey, tags, terms }) => {
      const tagsAsStrings = Object.entries(tags).map(([k, v]) => `${k}=${v}`);
      return {
        key: presetKey,
        name: getPresetTranslation(presetKey) ?? name ?? 'x',
        tags,
        tagsAsOneString: tagsAsStrings.join(', '),
        texts: [
          ...(getPresetTermsTranslation(presetKey) ?? terms ?? 'x').split(','),
          ...tagsAsStrings,
          presetKey,
        ],
      };
    },
  );
});

const num = (text, inputValue) =>
  match(text, inputValue, {
    insideWords: true,
    findAllOccurrences: true,
  }).length;

// return text.toLowerCase().includes(inputValue.toLowerCase());
const findInPresets = (inputValue) => {
  const start = performance.now();
  const results = presetsForSearch.map((presetForSearch) => {
    const name = num(presetForSearch.name, inputValue) * 10;
    const textsByOne = presetForSearch.texts.map((term) =>
      num(term, inputValue),
    );
    const sum = name + textsByOne.reduce((a, b) => a + b, 0);
    return { name, textsByOne, sum, presetForSearch };
  });
  const options = results
    .filter((result) => result.sum > 0)
    .sort((a, b) => {
      // by number of matches
      if (a.sum > b.sum) return -1;
      if (a.sum < b.sum) return 1;
      return 0;
    })
    .map((result) => ({ preset: result }));

  console.log('results time', performance.now() - start, options);
  return options;
};

const fetchOptions = throttle(async (inputValue, view, setOptions) => {
  const presetOptions = findInPresets(inputValue);
  const slice = presetOptions.slice(0, 3);
  setOptions(slice);

  const searchResponse = await fetchJson(getApiUrl(inputValue, view));
  const options = searchResponse.features;
  setOptions([
    ...(options?.length < 3 ? presetOptions : slice),
    ...(options || []),
  ]);
}, 400);

const SearchBox = () => {
  const { featureShown, feature, setFeature, setPreview } = useFeatureContext();
  const { view } = useMapStateContext();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const autocompleteRef = useRef();
  const mobileMode = useMobileMode();

  React.useEffect(() => {
    if (inputValue === '') {
      setOptions([]);
      return;
    }
    fetchOptions(inputValue, view, setOptions);
  }, [inputValue]);

  const closePanel = () => {
    setInputValue('');
    if (mobileMode) {
      setPreview(feature);
    }
    setFeature(null);
    Router.push(`/${window.location.hash}`);
  };

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
        />

        {featureShown && <ClosePanelButton onClick={closePanel} />}
      </StyledPaper>
    </TopPanel>
  );
};

export default SearchBox;
