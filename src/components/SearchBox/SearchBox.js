// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
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

const styles = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
};

// a = [
//   {
//     place_id: 93538005,
//     licence:
//       'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
//     osm_type: 'way',
//     osm_id: 31134664,
//     boundingbox: ['50.0902337', '50.0923471', '14.3210646', '14.3216013'],
//     lat: '50.0913465',
//     lon: '14.3213162',
//     display_name:
//       'Ke Džbánu, Liboc, Praha, okres Hlavní město Praha, Hlavní město Praha, Praha, 16100, Česká republika',
//     class: 'highway',
//     type: 'residential',
//     importance: 0.19999999999999998,
//     geojson: {
//       type: 'LineString',
//       coordinates: [
//         [14.3216013, 50.0902337],
//         [14.3210646, 50.0923471],
//       ],
//     },
//     extratags: { oneway: 'yes' },
//   },
// ];
// geometry: {type: "Point", coordinates: Array(2)}
// center: (2) [14.364232420921326, 50.09869083414364]
// osmMeta:
//   type: "node"
//   id: "3881528398"
// tags: {name: "Bořislavka"}
// skeleton: true
// nonOsmObject: false
// __proto__: Object

// https://nominatim.openstreetmap.org/search?q=Ke+dzbanu&format=json&extratags=1&viewbox=&polygon_geojson=1&polygon_threshold=0.1

const SearchInput = ({ classes, setFeature }) => {
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
    <Paper className={classes.root} elevation={1} ref={params.InputProps.ref}>
      <IconButton className={classes.iconButton} disabled>
        <SearchIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Prohledat OpenStreetMap"
        autoFocus
        {...params}
        onChange={e => setInputValue(e.target.value)}
      />
      <Divider className={classes.divider} />
      <IconButton
        className={classes.iconButton}
        aria-label="Zavřít panel"
        onClick={() => {
          setFeature(null);
          setInputValue('');
        }}
      >
        <CloseIcon />
      </IconButton>
    </Paper>
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

export default withStyles(styles)(SearchInput);
