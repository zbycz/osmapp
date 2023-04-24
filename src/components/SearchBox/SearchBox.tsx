import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import SearchIcon from '@material-ui/icons/Search';
// import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Router from 'next/router';
import { fetchJson } from '../../services/fetch';
import { useMapStateContext } from '../utils/MapStateContext';
import { useFeatureContext } from '../utils/FeatureContext';
import { AutocompleteInput } from './AutocompleteInput';
import { t } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';
// import { isDesktop, useMobileMode } from '../helpers';
import { useMobileMode } from '../helpers';
import { Loading } from '../App/Loading';

// const TopPanel = styled.div`
//   position: absolute;
//   height: 72px;
//   box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.12);
//   background-color: ${({ theme }) => theme.palette.background.searchBox};
//   padding: 10px;
//   box-sizing: border-box;

//   z-index: 1200;

//   width: 100%;
//   @media ${isDesktop} {
//     width: 410px;
//   }
// `;

// const StyledPaper = styled(Paper)`
//   padding: 2px 4px;
//   display: flex;
//   align-items: center;

//   .MuiAutocomplete-root {
//     flex: 1;
//   }
// `;

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
  return `https://photon.komoot.io/api/?q=${inputValue}&lon=${lon}&lat=${lat}&zoom=${lvl}`;
};

const fetchOptions = throttle(async (inputValue, view, setOptions) => {
  const searchResponse = await fetchJson(getApiUrl(inputValue, view));
  const options = searchResponse.features;
  setOptions(options || []);
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
    <div className="h-16 relative z-10 bg-zinc-800 shadow-md rounded-lg border-2 border-zinc-600 hover:brightness-125 overflow-hidden">
      <div className="flex items-center p-2" ref={autocompleteRef}>
        {/* TODO make the input fill the container so you can click anywhere in it */}

        <SearchIconButton disabled aria-label={t('searchbox.placeholder')}>
          <SearchIcon />
        </SearchIconButton>

        <AutocompleteInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          options={options}
          autocompleteRef={autocompleteRef}
        />

        <div className="ml-auto">
          {featureShown && <ClosePanelButton onClick={closePanel} />}
        </div>
      </div>
      <Loading />
    </div>
  );
};

export default SearchBox;
