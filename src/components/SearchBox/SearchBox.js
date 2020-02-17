// @flow

import React from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { fetchText } from '../../services/helpers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { fetchFromApi } from '../../services/osmApi';
import { useMapStateContext } from '../utils/MapStateContext';
import styled from 'styled-components';

const StyledPaper = styled(Paper)`
  padding: 2px 4px;
  display: flex;
  align-items: center;
`;

const SearchIconButton = styled(IconButton)`
  padding: 10;
`;

const SearchInput = styled(InputBase)`
  margin-left: 8;
  flex: 1;
`;

const StyledDivider = styled(Divider)`
  width: 1;
  height: 28;
  margin: 4;
`;

// https://nominatim.openstreetmap.org/search?q=Ke+dzbanu&format=json&extratags=1&viewbox=&polygon_geojson=1&polygon_threshold=0.1

const SearchBox = ({ setFeature }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const { setView } = useMapStateContext();

  const handlePlaceSelected = async (e, loc) => {
    if (!loc || inputValue === '') return;

    const { lat, lon, osm_type: type, osm_id: id, display_name } = loc;

    console.log('Location selected:', loc);
    const skeleton = {
      loading: true,
      skeleton: true,
      nonOsmObject: false,
      osmMeta: { type, id },
      center: [parseFloat(lon), parseFloat(lat)],
      tags: { name: display_name },
      properties: { class: loc.class },
    };
    console.log('-->skeleton:', skeleton);
    setFeature(skeleton);
    setView([17, lat, lon]);
    setFeature(await fetchFromApi(skeleton.osmMeta));
  };

  React.useEffect(() => {
    if (inputValue === '') {
      setOptions([]);
      return;
    }
    fetchText(
      'https://nominatim.openstreetmap.org/search?format=json&extratags=1&viewbox=&polygon_geojson=1&polygon_threshold=0.1&q=' +
        inputValue,
    ).then(results => {
      setOptions(JSON.parse(results) || []);
    });
  }, [inputValue]);

  const renderOption = option => {
    const matches = match(option.display_name, inputValue);
    const parts = parse(option.display_name, matches);

    return (
      <Grid container alignItems="center">
        <Grid item>
          <LocationOnIcon />
        </Grid>
        <Grid item xs>
          {parts.map((part, index) => (
            <span
              key={index}
              style={{ fontWeight: part.highlight ? 700 : 400 }}
            >
              {part.text}
            </span>
          ))}

          <Typography variant="body2" color="textSecondary">
            {option.class}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const renderInput = params => (
    <StyledPaper elevation={1} ref={params.InputProps.ref}>
      <SearchIconButton disabled>
        <SearchIcon />
      </SearchIconButton>
      <SearchInput
        placeholder="Prohledat OpenStreetMap"
        autoFocus
        {...params}
        onChange={e => setInputValue(e.target.value)}
      />
      <StyledDivider />
      <IconButton
        aria-label="Zavřít panel"
        onClick={() => {
          setFeature(null);
          setInputValue('');
        }}
      >
        <CloseIcon />
      </IconButton>
    </StyledPaper>
  );

  return (
    <Autocomplete
      getOptionLabel={option => option.display_name}
      onChange={handlePlaceSelected}
      filterOptions={x => x}
      options={options}
      autoComplete
      // disableCloseOnSelect
      autoHighlight
      forcePopupIcon={false}
      freeSolo
      disableOpenOnFocus
      renderInput={renderInput}
      renderOption={renderOption}
    />
  );
};

export default SearchBox;
