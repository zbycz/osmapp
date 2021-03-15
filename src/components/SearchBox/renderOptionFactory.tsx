import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Grid from '@material-ui/core/Grid';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Typography from '@material-ui/core/Typography';
import React from 'react';

// [
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
//     address: {
//       road: 'Ke Džbánu',
//       suburb: 'Liboc',
//       city: 'Praha',
//       county: 'okres Hlavní město Praha',
//       state: 'Praha',
//       postcode: '16100',
//       country: 'Česká republika',
//       country_code: 'cz',
//     },
//     geojson: {
//       type: 'LineString',
//       coordinates: [
//         [14.3216013, 50.0902337],
//         [14.3210646, 50.0923471],
//       ],
//     },
//   },
// ];

export const renderOptionFactory = (inputValue) => (option) => {
  const matches = match(option.display_name, inputValue);
  const parts = parse(option.display_name, matches);

  return (
    <Grid container alignItems="center">
      <Grid item>
        <LocationOnIcon />
      </Grid>
      <Grid item xs>
        {parts.map((part, index) => (
          <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
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
