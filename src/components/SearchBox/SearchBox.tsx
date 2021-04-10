import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import { onSelectedFactory } from './onSelectedFactory';
import { renderOptionFactory } from './renderOptionFactory';
import { SearchBoxInput } from './SearchBoxInput';
import { useMapStateContext } from '../utils/MapStateContext';
import { fetchJson } from '../../services/fetch';
import { useFeatureContext } from '../utils/FeatureContext';

const TopPanel = styled.div`
  position: absolute;
  height: 72px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.12);
  background-color: #eb5757;
  padding: 10px;
  box-sizing: border-box;

  z-index: 1200;

  width: 100%;
  @media (min-width: 410px) {
    width: 410px;
  }
`;

const getApiUrl = (bbox, inputValue) =>
  `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&viewbox=${bbox}&q=${inputValue}`; // polygon_geojson=1&polygon_threshold=0.1

const fetchNominatim = throttle(async (inputValue, bbox, setOptions) => {
  const options = await fetchJson(getApiUrl(bbox, inputValue));
  setOptions(options || []);
}, 400);

const SearchBox = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const { bbox, setView } = useMapStateContext();
  const { setFeature } = useFeatureContext();

  React.useEffect(() => {
    if (inputValue === '') {
      setOptions([]);
      return;
    }
    fetchNominatim(inputValue, bbox, setOptions);
  }, [inputValue]);

  return (
    <TopPanel>
      <Autocomplete
        inputValue={inputValue}
        options={options}
        filterOptions={(x) => x}
        getOptionLabel={(option) => option.display_name}
        onChange={onSelectedFactory(setFeature, setView)}
        autoComplete
        // autoHighlight
        clearOnEscape
        // disableCloseOnSelect
        freeSolo
        // disableOpenOnFocus
        renderInput={(params) => (
          <SearchBoxInput params={params} setInputValue={setInputValue} />
        )}
        renderOption={renderOptionFactory(inputValue)}
      />
    </TopPanel>
  );
};

export default SearchBox;
