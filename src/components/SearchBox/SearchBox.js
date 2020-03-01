// @flow

import React from 'react';
import { fetchJson } from '../../services/helpers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { onSelectedFactory } from './onSelectedFactory';
import { renderOptionFactory } from './renderOptionFactory';
import { SearchBoxInput } from './SearchBoxInput';
import { useMapStateContext } from '../utils/MapStateContext';
import styled from 'styled-components';

const TopPanel = styled.div`
  position: absolute;
  width: 410px;
  height: 72px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.12);
  background-color: #eb5757;
  padding: 10px;
  box-sizing: border-box;

  z-index: 1200;
`;

// https://nominatim.openstreetmap.org/search?q=Ke+dzbanu&format=json&addressdetails=1&viewbox=&polygon_geojson=1&polygon_threshold=0.1
const apiUrl = (s, bb) =>
  `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&viewbox=${bb}&q=${s}`;

const SearchBox = ({ feature, setFeature }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const { bbox, setView } = useMapStateContext();

  React.useEffect(() => {
    if (inputValue === '') {
      setOptions([]);
      return;
    }
    fetchJson(apiUrl(inputValue, bbox)).then(results => {
      setOptions(results || []);
    });
  }, [inputValue]);

  return (
    <TopPanel>
      <Autocomplete
        options={options}
        filterOptions={x => x}
        getOptionLabel={option => option.display_name}
        onChange={onSelectedFactory(setFeature, setView)}
        autoComplete
        autoHighlight
        clearOnEscape
        // disableCloseOnSelect
        freeSolo
        // disableOpenOnFocus
        renderInput={params => (
          <SearchBoxInput {...{ params, feature, setFeature, setInputValue }} />
        )}
        renderOption={renderOptionFactory(inputValue)}
      />
    </TopPanel>
  );
};

export default SearchBox;
