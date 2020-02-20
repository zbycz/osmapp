// @flow

import React from 'react';
import { fetchJson } from '../../services/helpers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { onSelectedFactory } from './onSelectedFactory';
import { renderOptionFactory } from './renderOptionFactory';
import { SearchBoxInput } from './SearchBoxInput';
import { useMapStateContext } from '../utils/MapStateContext';

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
    <Autocomplete
      options={options}
      filterOptions={x => x}
      getOptionLabel={option => option.display_name}
      onChange={onSelectedFactory(setFeature, setView)}
      autoComplete
      autoHighlight
      // disableCloseOnSelect
      freeSolo
      disableOpenOnFocus
      renderInput={params => (
        <SearchBoxInput {...{ params, feature, setFeature, setInputValue }} />
      )}
      renderOption={renderOptionFactory(inputValue)}
    />
  );
};

export default SearchBox;
