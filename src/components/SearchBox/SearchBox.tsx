import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, IconButton, Paper } from '@mui/material';
import Router from 'next/router';
import match from 'autosuggest-highlight/match';
import { fetchJson } from '../../services/fetch';
import { useMapStateContext } from '../utils/MapStateContext';
import { useFeatureContext } from '../utils/FeatureContext';
import { AutocompleteInput } from './AutocompleteInput';
import { intl, t } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { isDesktop, useMobileMode } from '../helpers';
import { presets } from '../../services/tagging/data';
import {
  fetchSchemaTranslations,
  getPresetTermsTranslation,
  getPresetTranslation,
} from '../../services/tagging/translations';
import { SEARCH_BOX_HEIGHT } from './consts';
import { useStarsContext } from '../utils/StarsContext';

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

let presetsForSearch;
const getPresetsForSearch = async () => {
  if (presetsForSearch) {
    return presetsForSearch;
  }

  await fetchSchemaTranslations();

  // resolve symlinks to {landuse...} etc
  presetsForSearch = Object.values(presets)
    .filter(({ searchable }) => searchable === undefined || searchable)
    .filter(({ locationSet }) => !locationSet?.include)
    .filter(({ tags }) => Object.keys(tags).length > 0)
    .map(({ name, presetKey, tags, terms }) => {
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
    });

  return presetsForSearch;
};

const num = (text, inputValue) =>
  match(text, inputValue, {
    insideWords: true,
    findAllOccurrences: true,
  }).length;
// return text.toLowerCase().includes(inputValue.toLowerCase());

const findInPresets = async (inputValue) => {
  const results = (await getPresetsForSearch()).map((preset) => {
    const name = num(preset.name, inputValue) * 10;
    const textsByOne = preset.texts.map((term) => num(term, inputValue));
    const sum = name + textsByOne.reduce((a, b) => a + b, 0);
    return { name, textsByOne, sum, presetForSearch: preset }; // TODO refactor this, not needed anymore
  });

  const nameMatches = results
    .filter((result) => result.name > 0)
    .map((result) => ({ preset: result }));

  const rest = results
    .filter((result) => result.name === 0 && result.sum > 0)
    .map((result) => ({ preset: result }));

  return nameMatches.length
    ? { nameMatches, rest }
    : { nameMatches: rest, rest: [] };
};

const getOverpassQuery = (inputValue: string) => {
  if (inputValue.match(/^[-:_a-zA-Z0-9]+=/)) {
    const [key, value] = inputValue.split('=', 2);

    return [{ overpass: { [key]: value || '*' } }];
  }

  return [];
};

const fetchOptions = debounce(
  async (inputValue, view, setOptions, nameMatches = [], rest = []) => {
    try {
      const searchResponse = await fetchJson(getApiUrl(inputValue, view), {
        abortableQueueName: 'search',
      });
      const options = searchResponse.features;

      const before = nameMatches.slice(0, 2);
      const after = [...nameMatches.slice(2), ...rest];

      setOptions([...before, ...(options || []), ...after]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('search aborted', e);
    }
  },
  400,
);

const useFetchOptions = (inputValue: string, setOptions) => {
  const { view } = useMapStateContext();
  const { stars } = useStarsContext();

  useEffect(() => {
    (async () => {
      if (inputValue === '') {
        const options = stars.map(({ shortId, poiType, label }) => ({
          star: { shortId, poiType, label },
        }));
        setOptions(options);
        return;
      }

      if (inputValue.length > 2) {
        const overpassQuery = getOverpassQuery(inputValue);
        const { nameMatches, rest } = await findInPresets(inputValue);
        setOptions([
          ...overpassQuery,
          ...nameMatches.slice(0, 2),
          { loader: true },
        ]);
        const before = [...overpassQuery, ...nameMatches];
        fetchOptions(inputValue, view, setOptions, before, rest);
        return;
      }

      setOptions([{ loader: true }]);
      fetchOptions(inputValue, view, setOptions);
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
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [overpassLoading, setOverpassLoading] = useState(false);
  const autocompleteRef = useRef();
  const onClosePanel = useOnClosePanel();

  useFetchOptions(inputValue, setOptions);

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
